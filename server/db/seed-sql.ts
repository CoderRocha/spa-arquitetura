import { readFile } from 'node:fs/promises'

export const readSeedSql = () => readFile(new URL('./sql/seed.sql', import.meta.url), 'utf8')
