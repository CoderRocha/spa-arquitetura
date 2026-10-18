import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { eq } from 'drizzle-orm'
import { Hono, type MiddlewareHandler } from 'hono'
import * as v from 'valibot'
import { AVATAR_MAX_BYTES, AVATAR_MIME_TYPES, profileInputSchema, type Profile } from '@contracts/profile'
import { user } from '@server/db/auth-schema'
import type { Db } from '@server/db/client'
import type { AppEnv } from '@server/http/env'
import { messagesFor } from '@server/http/messages'
import { invalidProblem, problemResponse } from '@server/http/problem'

const AVATAR_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

const avatarFileSchema = v.pipe(
  v.file(),
  v.mimeType([...AVATAR_MIME_TYPES]),
  v.maxSize(AVATAR_MAX_BYTES),
)

type UserRow = typeof user.$inferSelect

const toProfile = ({ id, name, email, bio, image, onboarded }: UserRow): Profile => ({
  id,
  name,
  email,
  bio: bio ?? '',
  avatarUrl: image,
  onboarded: onboarded ?? false,
})

const unauthorized = (locale: AppEnv['Variables']['locale']) =>
  problemResponse({ status: 401, ...messagesFor(locale).unauthorized })

type ProfileRoutesOptions = {
  db: Db
  storageDir: string
  uploadRateLimit: MiddlewareHandler<AppEnv>
}

export const profileRoutes = ({ db, storageDir, uploadRateLimit }: ProfileRoutesOptions) => {
  const updateUser = async (userId: string, values: Partial<typeof user.$inferInsert>) => {
    const [updated] = await db.update(user).set(values).where(eq(user.id, userId)).returning()
    return updated
  }

  return new Hono<AppEnv>()
    .get('/', async (c) => {
      const row = await db.select().from(user).where(eq(user.id, c.get('authUserId'))).get()
      return row ? c.json(toProfile(row)) : unauthorized(c.get('locale'))
    })
    .put('/', async (c) => {
      const body = v.safeParse(profileInputSchema, await c.req.json().catch(() => null))
      if (!body.success) return invalidProblem(c.get('locale'), body.issues)
      const updated = await updateUser(c.get('authUserId'), { ...body.output, onboarded: true, updatedAt: new Date() })
      return updated ? c.json(toProfile(updated)) : unauthorized(c.get('locale'))
    })
    .post('/avatar', uploadRateLimit, async (c) => {
      const file = v.safeParse(avatarFileSchema, (await c.req.formData()).get('file'))
      if (!file.success) return problemResponse({ status: 422, ...messagesFor(c.get('locale')).invalidFile })
      const fileName = `${randomUUID()}.${AVATAR_EXTENSIONS[file.output.type] ?? 'img'}`
      // ponytail: local disk storage; swap for S3/R2 before running more than one instance
      await mkdir(storageDir, { recursive: true })
      await writeFile(join(storageDir, fileName), Buffer.from(await file.output.arrayBuffer()))
      const updated = await updateUser(c.get('authUserId'), { image: `/api/uploads/${fileName}`, updatedAt: new Date() })
      return updated ? c.json(toProfile(updated)) : unauthorized(c.get('locale'))
    })
}
