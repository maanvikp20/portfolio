import React from 'react'
import './globals.css'
import { Instrument_Serif } from 'next/font/google'

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
      </body>
    </html>
  )
}