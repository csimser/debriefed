import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://getdebriefed.co', lastModified: new Date(), priority: 1 },
    { url: 'https://getdebriefed.co/pricing', lastModified: new Date(), priority: 0.8 },
    { url: 'https://getdebriefed.co/help', lastModified: new Date(), priority: 0.5 },
    { url: 'https://getdebriefed.co/login', lastModified: new Date(), priority: 0.5 },
    { url: 'https://getdebriefed.co/signup', lastModified: new Date(), priority: 0.7 },
    { url: 'https://getdebriefed.co/privacy', lastModified: new Date(), priority: 0.3 },
    { url: 'https://getdebriefed.co/terms', lastModified: new Date(), priority: 0.3 },
  ]
}
