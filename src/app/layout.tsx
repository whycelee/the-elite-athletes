import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Elite Athletes',
  description: 'Premium Sport Wear',
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}