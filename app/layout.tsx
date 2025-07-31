import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';

export const metadata: Metadata = {
  title: {
    default: 'JobSearch - Find Your Dream Job',
    template: '%s | JobSearch'
  },
  description: 'Discover thousands of job opportunities from top companies. Find your perfect job match with advanced search, application tracking, and career insights.',
  keywords: ['jobs', 'careers', 'employment', 'hiring', 'job search', 'remote jobs', 'full-time jobs', 'part-time jobs'],
  authors: [{ name: 'JobSearch Team' }],
  creator: 'JobSearch',
  publisher: 'JobSearch',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://jobsearch-app.com'),
  openGraph: {
    title: 'JobSearch - Find Your Dream Job',
    description: 'Discover thousands of job opportunities from top companies. Find your perfect job match with advanced search and application tracking.',
    url: 'https://jobsearch-app.com',
    siteName: 'JobSearch',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobSearch - Find Your Dream Job',
    description: 'Discover thousands of job opportunities from top companies.',
    creator: '@jobsearch',
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
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <SWRConfig
          value={{
            fallback: {
              // We do NOT await here
              // Only components that read this data will suspend
              '/api/user': getUser()
            }
          }}
        >
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}
