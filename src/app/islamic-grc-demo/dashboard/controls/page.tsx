'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Shield,
  Search,
  Filter,
  Lock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  BookOpen,
} from 'lucide-react'

import {
  getControlsByCategory,
  searchControls,
  getControlsByProduct,
  getControlStats,
  type Control,
  type ControlCategory,
} from '@/lib/grc-controls'

import type { ProductType } from '@/lib/types/grc-demo-types'

export default function ControlLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ProductType | 'all'>('all')
  const [showMandatoryOnly, setShowMandatoryOnly] = useState(false)

  // Get controls data
  const allControls = useMemo(() => getControlsByCategory(), [])
  const stats = useMemo(() => getControlStats(), [])

  // Apply filters
  const filteredCategories = useMemo(() => {
    let categories = allControls

    // Search filter
    if (searchQuery.trim()) {
      const searchResults = searchControls(searchQuery)
      const searchIds = new Set(searchResults.map(c => c.id))

      categories = categories.map(cat => ({
        ...cat,
        controls: cat.controls.filter(c => searchIds.has(c.id)),
      })).filter(cat => cat.controls.length > 0)
    }

    // Product filter
    if (selectedProduct !== 'all') {
      categories = categories.map(cat => ({
        ...cat,
        controls: cat.controls.filter(c => c.usedInProducts.includes(selectedProduct)),
      })).filter(cat => cat.controls.length > 0)
    }

    // Mandatory filter
    if (showMandatoryOnly) {
      categories = categories.map(cat => ({
        ...cat,
        controls: cat.controls.filter(c => c.isMandatory),
      })).filter(cat => cat.controls.length > 0)
    }

    return categories
  }, [allControls, searchQuery, selectedProduct, showMandatoryOnly])

  const totalDisplayedControls = filteredCategories.reduce((sum, cat) => sum + cat.controls.length, 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Control Library
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse GRC controls extracted from Qatar Islamic finance templates
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Controls</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mandatory</CardTitle>
            <Lock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mandatory}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.mandatory / stats.total) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hard Gates</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hardGates}</div>
            <p className="text-xs text-muted-foreground">Cannot be bypassed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byCategory.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search controls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Product Filter */}
            <Select value={selectedProduct} onValueChange={(val) => setSelectedProduct(val as ProductType | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="ijarah">Ijarah (Islamic Lease)</SelectItem>
                <SelectItem value="murabaha">Murabaha (Cost-Plus Sale)</SelectItem>
                <SelectItem value="mudaraba">Mudaraba (Profit-Sharing)</SelectItem>
              </SelectContent>
            </Select>

            {/* Mandatory Filter */}
            <Button
              variant={showMandatoryOnly ? 'default' : 'outline'}
              onClick={() => setShowMandatoryOnly(!showMandatoryOnly)}
              className="w-full"
            >
              <Lock className="h-4 w-4 mr-2" />
              {showMandatoryOnly ? 'Showing Mandatory Only' : 'Show Mandatory Only'}
            </Button>
          </div>

          {/* Active Filters Summary */}
          {(searchQuery || selectedProduct !== 'all' || showMandatoryOnly) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                Showing {totalDisplayedControls} of {stats.total} controls
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedProduct('all')
                  setShowMandatoryOnly(false)
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls by Category */}
      <Accordion type="multiple" defaultValue={filteredCategories.map(cat => cat.id)} className="space-y-4">
        {filteredCategories.map((category) => (
          <AccordionItem key={category.id} value={category.id} className="border rounded-lg">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <Badge variant="secondary">{category.controls.length} controls</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 mt-4">
                {category.controls.map((control) => (
                  <ControlCard key={control.id} control={control} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No controls found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No controls match your current filters. Try adjusting your search or clearing filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ControlCard({ control }: { control: Control }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card className="border-l-4" style={{ borderLeftColor: control.isMandatory ? '#dc2626' : '#3b82f6' }}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base flex items-center gap-2">
              {control.name}
              {control.isHardGate && (
                <Badge variant="destructive" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  HARD GATE
                </Badge>
              )}
              {control.isMandatory && !control.isHardGate && (
                <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                  Mandatory
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">{control.description}</CardDescription>
          </div>
        </div>

        {/* Control Metadata */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="outline" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            {control.source}
          </Badge>

          {control.usedInProducts.map((product) => (
            <Badge key={product} variant="outline" className="text-xs bg-blue-50">
              {product.charAt(0).toUpperCase() + product.slice(1)}
            </Badge>
          ))}

          {control.usedInModules.length > 0 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {control.usedInModules.length} module{control.usedInModules.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Constraints (if any) */}
      {control.constraints.length > 0 && (
        <CardContent>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="mb-2"
          >
            {showDetails ? 'Hide' : 'Show'} Policy Constraints ({control.constraints.length})
          </Button>

          {showDetails && (
            <div className="space-y-2 mt-2">
              {control.constraints.map((constraint, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-sm ${
                    constraint.cannotModify
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {constraint.cannotModify ? (
                      <Lock className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-gray-800">{constraint.text}</p>
                      {constraint.cannotModify && (
                        <p className="text-xs text-red-600 mt-1">Cannot be modified or bypassed</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
