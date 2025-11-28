import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://my-servey-frontend.vercel.app'

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1, // Highest priority for the homepage
        },
        {
            url: `${baseUrl}/student-survey`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9, // High priority for key content
        },
        {
            url: `${baseUrl}/teacher-survey`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9, // High priority for key content
        },
        // We do NOT include /admin here
    ]
}