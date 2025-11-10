/**
 * ISLAMIC GRC DEMO LAYOUT
 * =======================
 * Demo-specific layout wrapping all Islamic GRC Demo pages
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Islamic GRC Demo | AI native Governance, Risk & Compliance',
  description:
    'Interactive demo of composable Islamic GRC workflows for Ijarah, Murabaha, and Mudaraba products. Built on AAOIFI, IFSB, QCB, and QFCRA standards.',
  keywords: [
    'Islamic GRC',
    'Shariah Compliance',
    'AAOIFI',
    'IFSB',
    'Qatar',
    'Ijarah',
    'Murabaha',
    'Mudaraba',
    'Workflow Automation',
  ],
}

export default function IslamicGRCDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
