/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://cliniclane.com', // Replace with your website URL
    generateRobotsTxt: true, // Automatically generate robots.txt
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: ['/admin'], // Exclude specific pages
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
