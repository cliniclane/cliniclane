/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://cliniclane.com', // Replace with your website URL
    generateRobotsTxt: true, // Automatically generate robots.txt
    changefreq: 'daily',
    transform: async (config, path) => {
        // Define custom priorities for specific pages
        const priorityMap = {
            '/': 1.0, // Homepage - most important
            '/contact': 0.6, // Contact page - less important
        };

        // If the page follows the dynamic `/[slug]` pattern, set priority to 1.0
        if (path.match(/^\/[^/]+$/)) {
            return {
                loc: path,
                changefreq: 'daily',
                priority: 1.0,
                lastmod: new Date().toISOString(),
            };
        }

        return {
            loc: path, // The page URL
            changefreq: 'daily',
            priority: priorityMap[path] ?? 0.7, // Default priority for any other page
            lastmod: new Date().toISOString(),
        };
    },
    sitemapSize: 5000,
    exclude: ['/admin', "/admin/article/new", "/admin/login", "/admin/pages"], // Exclude specific pages
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin'], // Disallow specific paths
            },
        ],
    },
};
