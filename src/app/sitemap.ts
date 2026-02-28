import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: 'https://getdebriefed.co', lastModified: new Date(), priority: 1 },
    { url: 'https://getdebriefed.co/pricing', lastModified: new Date(), priority: 0.8 },
    { url: 'https://getdebriefed.co/help', lastModified: new Date(), priority: 0.5 },
    { url: 'https://getdebriefed.co/login', lastModified: new Date(), priority: 0.5 },
    { url: 'https://getdebriefed.co/signup', lastModified: new Date(), priority: 0.7 },
    { url: 'https://getdebriefed.co/privacy', lastModified: new Date(), priority: 0.3 },
    { url: 'https://getdebriefed.co/terms', lastModified: new Date(), priority: 0.3 },
    { url: 'https://getdebriefed.co/mos', lastModified: new Date(), priority: 0.9 },
  ]

  // Fetch all MOS codes for dynamic pages
  const supabase = createAdminClient()
  const { data: mosCodes } = await supabase
    .from('dict_mos_to_civilian')
    .select('military_code')
    .order('military_code')

  const mosPages: MetadataRoute.Sitemap = (mosCodes || []).map((row) => ({
    url: `https://getdebriefed.co/mos/${row.military_code.toLowerCase()}`,
    lastModified: new Date(),
    priority: 0.7,
  }))

  return [...staticPages, ...mosPages]
}
