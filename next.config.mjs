import nextra from 'nextra'

const isGitHubPages = process.env.GITHUB_PAGES === 'true'

const withNextra = nextra({
  latex: false,
  search: {
    codeblocks: true
  },
  contentDirBasePath: '/docs'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isGitHubPages ? '/doklab-docs' : '',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default withNextra(nextConfig)
