import { EmptyCollection } from './EmptyCollection'

const BlogEmpty = () => (
  <EmptyCollection
    collectionLabel="Статей"
    ctaLabel="Написать статью"
    ctaHref="/admin/collections/blog/create"
    description="Первая статья — половина контент-стратегии."
  />
)

export default BlogEmpty
