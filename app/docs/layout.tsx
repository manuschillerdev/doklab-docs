import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Image from 'next/image'
import Link from 'next/link'
import 'nextra-theme-docs/style.css'

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap('/docs')

  const navbar = (
    <Navbar
      logo={
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="doklab" width={28} height={28} className="rounded" />
          <span className="font-mono font-bold">doklab</span>
        </Link>
      }
      projectLink="https://github.com/manuschillerdev/doklab"
    />
  )

  return (
    <>
      <Head />
      <Layout
        navbar={navbar}
        footer={
          <Footer>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
              <span>MIT {new Date().getFullYear()} © doklab</span>
              <div className="flex gap-4 text-sm">
                <Link href="/" className="hover:underline">Home</Link>
                <Link href="https://github.com/manuschillerdev/doklab" className="hover:underline">GitHub</Link>
              </div>
            </div>
          </Footer>
        }
        editLink="Edit this page on GitHub"
        docsRepositoryBase="https://github.com/manuschillerdev/doklab/tree/main/landing/content"
        sidebar={{ defaultMenuCollapseLevel: 1 }}
        pageMap={pageMap}
        darkMode={false}
        nextThemes={{ forcedTheme: 'dark' }}
      >
        {children}
      </Layout>
    </>
  )
}
