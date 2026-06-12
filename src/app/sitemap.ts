import { MetadataRoute } from 'next'
import { getAllMOSCodes } from '@/lib/mos-page-data'
import { getAllPosts } from '@/lib/mdx'
import { APP_URL } from '@/lib/site-config'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: new Date(), priority: 1 },
    { url: `${APP_URL}/about`, lastModified: new Date(), priority: 0.6 },
    { url: `${APP_URL}/blog`, lastModified: new Date(), priority: 0.8 },
    { url: `${APP_URL}/help`, lastModified: new Date(), priority: 0.5 },
    { url: `${APP_URL}/privacy`, lastModified: new Date(), priority: 0.3 },
    { url: `${APP_URL}/terms`, lastModified: new Date(), priority: 0.3 },
    { url: `${APP_URL}/mos`, lastModified: new Date(), priority: 0.9 },
  ]

  const mosPages: MetadataRoute.Sitemap = (await getAllMOSCodes()).map((row) => ({
    url: `${APP_URL}/mos/${row.code.toLowerCase()}`,
    lastModified: new Date(),
    priority: 0.7,
  }))

  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${APP_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.6,
  }))

  return [...staticPages, ...mosPages, ...blogPages]
}
