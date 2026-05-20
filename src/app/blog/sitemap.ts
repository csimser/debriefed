import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { APP_URL } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const BASE_URL = APP_URL

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: post.featured ? 0.9 : 0.7,
  }))

  return [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...postEntries,
  ]
}
