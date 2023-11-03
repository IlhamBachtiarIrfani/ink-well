/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3000/:path*' // Proxy to Backend
            }
        ]
    }
}

module.exports = nextConfig
