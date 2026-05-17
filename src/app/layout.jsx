import React from 'react'
import './globals.css'
import { Instrument_Serif } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <head>
        <title>Maanvik Poddar</title>
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}