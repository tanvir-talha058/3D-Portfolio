import type { MetadataRoute } from 'next';

import { site } from './data';

/** One page, but a sitemap is how a crawler learns it exists at all. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
