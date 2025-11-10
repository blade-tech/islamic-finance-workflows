'use client'

/**
 * PRODUCT SELECTOR
 * ================
 * Product selection with active and "coming soon" ghost cards
 *
 * Active Products:
 * - Ijarah (Islamic Lease)
 * - Murabaha (Cost-Plus Financing)
 * - Mudaraba (Profit-Sharing)
 *
 * Coming Soon:
 * - Sukuk (Islamic Bonds)
 * - Islamic Funds
 * - Takaful (Islamic Insurance)
 * - Musharaka (Partnership)
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Shield, FileText } from 'lucide-react'
import type { ProductType, ProductInfo } from '@/lib/types/grc-demo-types'

interface ProductSelectorProps {
  selectedProduct: ProductType | null
  onSelect: (product: ProductType) => void
}

const PRODUCTS: ProductInfo[] = [
  // Active Products
  {
    id: 'ijarah',
    name: 'Ijarah',
    nameArabic: 'الإجارة',
    description:
      'Asset-based leasing where lessor maintains ownership and major maintenance obligations',
    standards: ['AAOIFI SS-9', 'QCB Guidelines', 'QFCRA IBANK 1.3.12'],
    status: 'active',
    category: 'financing',
  },
  {
    id: 'murabaha',
    name: 'Murabaha',
    nameArabic: 'المرابحة',
    description:
      'Cost-plus sale with full transparency on acquisition cost and profit markup',
    standards: ['AAOIFI FAS-28', 'QCB Guidelines', 'QFCRA IBANK'],
    status: 'active',
    category: 'financing',
  },
  {
    id: 'mudaraba',
    name: 'Mudaraba',
    nameArabic: 'المضاربة',
    description:
      'Profit-sharing partnership between capital provider (rab al-mal) and entrepreneur (mudarib)',
    standards: ['AAOIFI FAS-3', 'IFSB-10', 'QCB Investment Accounts'],
    status: 'active',
    category: 'investment',
  },

  // Coming Soon Products
  {
    id: 'sukuk',
    name: 'Sukuk',
    nameArabic: 'الصكوك',
    description:
      'Asset-backed securities with profit-sharing or rental returns',
    standards: ['AAOIFI SS-17', 'IFSB-15', 'QFCRA'],
    status: 'coming-soon',
    category: 'capital-markets',
  },
  {
    id: 'funds',
    name: 'Islamic Funds',
    nameArabic: 'الصناديق الإسلامية',
    description: 'Shariah-compliant investment funds with screening criteria',
    standards: ['AAOIFI GS-21', 'IFSB-10', 'QFCRA CIR'],
    status: 'coming-soon',
    category: 'investment',
  },
  {
    id: 'takaful',
    name: 'Takaful',
    nameArabic: 'التكافل',
    description: 'Islamic insurance based on mutual cooperation and tabarru',
    standards: ['AAOIFI SS-26/27', 'IFSB-8', 'QCB Takaful Rules'],
    status: 'coming-soon',
    category: 'insurance',
  },
  {
    id: 'musharaka',
    name: 'Musharaka',
    nameArabic: 'المشاركة',
    description: 'Joint venture partnership with shared capital and management',
    standards: ['AAOIFI FAS-4', 'Participatory Ventures', 'QCB'],
    status: 'coming-soon',
    category: 'financing',
  },
]

export function ProductSelector({
  selectedProduct,
  onSelect,
}: ProductSelectorProps) {
  const activeProducts = PRODUCTS.filter((p) => p.status === 'active')
  const comingSoonProducts = PRODUCTS.filter((p) => p.status === 'coming-soon')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Select Islamic Finance Product
        </h3>
        <p className="text-sm text-gray-600">Choose product structure to configure</p>
      </div>

      {/* Active Products */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Available Products
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeProducts.map((product) => {
            const isSelected = selectedProduct === product.id

            return (
              <Card
                key={product.id}
                className={`
                  transition-all cursor-pointer
                  ${
                    isSelected
                      ? 'border-2 border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-2 border-purple-200 hover:border-purple-400 hover:shadow-md'
                  }
                `}
                onClick={() => onSelect(product.id)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base text-purple-900 mb-1">
                        {product.name}
                      </CardTitle>
                      <p className="text-xs text-gray-600 font-arabic">
                        {product.nameArabic}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-700 mb-3 min-h-[48px]">
                    {product.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Standards:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {product.standards.map((standard, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs bg-white"
                            >
                              {standard}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Coming Soon Products */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-3">Coming Soon</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {comingSoonProducts.map((product) => (
            <Card
              key={product.id}
              className="border-2 border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
            >
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm text-gray-600 mb-1">
                      {product.name}
                    </CardTitle>
                    <p className="text-xs text-gray-500 font-arabic">
                      {product.nameArabic}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Soon
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <p className="text-xs text-gray-600 mb-2">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Product Details Panel */}
      {selectedProduct && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-purple-900 mb-2">
                {PRODUCTS.find((p) => p.id === selectedProduct)?.name} Workflow
              </h4>
              <p className="text-xs text-purple-800 mb-2">
                {PRODUCTS.find((p) => p.id === selectedProduct)?.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {PRODUCTS.find((p) => p.id === selectedProduct)?.standards.map(
                  (standard, idx) => (
                    <Badge
                      key={idx}
                      className="bg-purple-600 hover:bg-purple-700 text-xs"
                    >
                      {standard}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
