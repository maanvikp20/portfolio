import React from 'react'
import './globals.css'
import { Instrument_Serif } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
})

export const metadata = {
  title: 'Maanvik Poddar',
  description: 'Personal Portfolio & Blog',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}