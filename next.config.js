/** @type {import('next').NextConfig} */
const nextConfig = {
    // prefer loading of es modules over commonjs
    // reactStrictMode: true,
    experimental: { esmExternals: 'loose' }
}

module.exports = nextConfig
