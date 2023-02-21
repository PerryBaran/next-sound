/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'soundcloud-clone.s3.eu-west-2.amazonaws.com',
        port: '',
        pathname: '/**'
      },
    ]
  }
}

module.exports = nextConfig
