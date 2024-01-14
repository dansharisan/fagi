import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fear and Greed Index',
  description: 'Check Fear and Greed Index for Stock & Crypto market',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <footer className="flex flex-col items-center w-full bg-white mt-2 mb-2">
          <p className="text-center text-gray-500">© 2024 Fear n Greed Index. All rights reserved.</p>
        </footer>
        <hr />
      </body>
    </html>
  )
}
