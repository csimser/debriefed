import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { APP_URL } from '@/lib/site-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: new Date(), priority: 1 },
    { url: `${APP_URL}/pricing`, lastModified: new Date(), priority: 0.8 },
    { url: `${APP_URL}/about`, lastModified: new Date(), priority: 0.6 },
    { url: `${APP_URL}/blog`, lastModified: new Date(), priority: 0.8 },
    { url: `${APP_URL}/help`, lastModified: new Date(), priority: 0.5 },
    { url: `${APP_URL}/login`, lastModified: new Date(), priority: 0.5 },
    { url: `${APP_URL}/signup`, lastModified: new Date(), priority: 0.7 },
    { url: `${APP_URL}/privacy`, lastModified: new Date(), priority: 0.3 },
    { url: `${APP_URL}/terms`, lastModified: new Date(), priority: 0.3 },
    { url: `${APP_URL}/mos`, lastModified: new Date(), priority: 0.9 },
  ]

  // Fetch all MOS codes for dynamic pages
  const supabase = createAdminClient()
  const { data: mosCodes } = await supabase
    .from('dict_mos_to_civilian')
    .select('military_code')
    .order('military_code')

  const mosPages: MetadataRoute.Sitemap = (mosCodes || []).map((row) => ({
    url: `${APP_URL}/mos/${row.military_code.toLowerCase()}`,
    lastModified: new Date(),
    priority: 0.7,
  }))

  return [...staticPages, ...mosPages]
}
