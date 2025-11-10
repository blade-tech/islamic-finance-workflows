'use client'

/**
 * JURISDICTION SELECTOR
 * ====================
 * Ghost card design for jurisdiction selection
 *
 * - Qatar: Active (fully functional)
 * - UAE, Saudi, Malaysia: Coming Soon (ghost cards with dates)
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'
import type { Jurisdiction, JurisdictionInfo } from '@/lib/types/grc-demo-types'

interface JurisdictionSelectorProps {
  selectedJurisdiction: Jurisdiction | null
  onSelect: (jurisdiction: Jurisdiction) => void
}

const JURISDICTIONS: JurisdictionInfo[] = [
  {
    id: 'qatar',
    name: 'Qatar',
    flag: '🇶🇦',
    status: 'active',
  },
  {
    id: 'uae',
    name: 'UAE (DFSA/ADGM)',
    flag: '🇦🇪',
    status: 'coming-soon',
    comingDate: 'Q2 2026',
  },
  {
    id: 'saudi',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    status: 'coming-soon',
    comingDate: 'Q3 2026',
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    flag: '🇲🇾',
    status: 'coming-soon',
    comingDate: 'Q3 2026',
  },
]

export function JurisdictionSelector({
  selectedJurisdiction,
  onSelect,
}: JurisdictionSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Select Jurisdiction
        </h3>
        <p className="text-sm text-gray-600">
          Choose regulatory jurisdiction for your product
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {JURISDICTIONS.map((jurisdiction) => {
          const isSelected = selectedJurisdiction === jurisdiction.id
          const isActive = jurisdiction.status === 'active'
          const isDisabled = jurisdiction.status === 'coming-soon'

          return (
            <Card
              key={jurisdiction.id}
              className={`
                transition-all cursor-pointer
                ${
                  isActive
                    ? isSelected
                      ? 'border-2 border-green-500 bg-green-50 shadow-md'
                      : 'border-2 border-green-200 bg-green-50 hover:border-green-400 hover:shadow-md'
                    : 'border-2 border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                }
              `}
              onClick={() => isActive && onSelect(jurisdiction.id)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{jurisdiction.flag}</div>
                    <CardTitle
                      className={`text-lg ${isActive ? 'text-green-900' : 'text-gray-600'}`}
                    >
                      {jurisdiction.name}
                    </CardTitle>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isActive ? (
                  <Badge className="bg-green-600 hover:bg-green-700">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-600">
                    Coming {jurisdiction.comingDate}
                  </Badge>
                )}

                {isActive && (
                  <p className="text-xs text-green-700 mt-2">
                    QCB • QFCRA • AAOIFI
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedJurisdiction === 'qatar' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">
            Qatar Regulatory Framework
          </h4>
          <p className="text-xs text-blue-800">
            Workflows will comply with: Qatar Central Bank (QCB) regulations •
            QFCRA IBANK prudential rules • AAOIFI GS/SS/FAS standards • IFSB
            risk management framework
          </p>
        </div>
      )}
    </div>
  )
}
