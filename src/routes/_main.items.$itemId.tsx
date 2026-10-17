import { createFileRoute, notFound } from '@tanstack/react-router'
import { isFriendlyError } from '@core/http-resource'
import { itemDetailQuery } from '@core/queries'
import { ItemDetail } from '@features/items/detail'

const ItemRoute = () => {
  const { itemId } = Route.useParams()
  const navigate = Route.useNavigate()
  return (
    <ItemDetail
      itemId={itemId}
      onDeleted={() => {
        void navigate({ to: '/items' })
      }}
    />
  )
}

export const Route = createFileRoute('/_main/items/$itemId')({
  loader: async ({ context, params }) => {
    try {
      const item = await context.queryClient.query(itemDetailQuery(params.itemId))
      return { title: item.name }
    } catch (error) {
      if (isFriendlyError(error) && error.status === 404) throw notFound()
      throw error
    }
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title }] }),
  component: ItemRoute,
})
