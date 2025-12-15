import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ChatBot from '@/components/chatbot/ChatBot'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
const appName = process.env.APP_NAME || 'COSTAATT Tech Hub'

export const metadata: Metadata = {
  title: {
    default: `${appName} - Interactive Learning Experience`,
    template: `%s | ${appName}`,
  },
  description: 'Explore cutting-edge technology, book visits, earn badges, and showcase your creations at the COSTAATT Tech Hub.',
  keywords: ['technology', 'education', 'innovation', 'VR', 'AR', '3D printing', 'IoT', 'COSTAATT', 'Trinidad', 'Tobago'],
  authors: [{ name: 'COSTAATT' }],
  creator: 'COSTAATT',
  publisher: 'COSTAATT',
  metadataBase: new URL(appUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    siteName: appName,
    title: `${appName} - Interactive Learning Experience`,
    description: 'Explore cutting-edge technology, book visits, earn badges, and showcase your creations at the COSTAATT Tech Hub.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: appName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${appName} - Interactive Learning Experience`,
    description: 'Explore cutting-edge technology, book visits, earn badges, and showcase your creations at the COSTAATT Tech Hub.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0071e3" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ChatBot />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#000',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
              },
              success: {
                iconTheme: {
                  primary: '#0071e3',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff3b30',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
        {process.env.GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}

