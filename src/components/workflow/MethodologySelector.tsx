'use client'

/**
 * METHODOLOGY SELECTOR
 * ====================
 * Standalone component for selecting digitized methodologies.
 *
 * WHAT THIS DOES:
 * - Lists all available digitized methodologies (Islamic finance, environmental, etc.)
 * - Allows selection of existing methodology OR
 * - Allows upload of document to digitize new methodology
 * - Shows detailed preview of selected methodology
 * - Filters by type, category, standard, status
 *
 * WHY SEPARATE:
 * - User requested this as Step 2 replacement (separate component)
 * - Can be "plugged in" to existing workflow later
 * - Maintains existing app stability
 *
 * BASED ON:
 * - Hedera Guardian methodology digitization framework
 * - Step2WorkflowSelection component pattern
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Info, Loader2, Upload, FileCheck, Users, Clock, Filter } from 'lucide-react'
import { MethodologyCard } from './MethodologyCard'
import { MethodologyUploadFlow } from './MethodologyUploadFlow'
import type { Methodology, MethodologyListFilters } from '@/lib/types'

export function MethodologySelector() {
  const [methodologies, setMethodologies] = useState<Methodology[]>([])
  const [selectedMethodology, setSelectedMethodology] = useState<Methodology | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMockData, setIsMockData] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  // Filters
  const [filters, setFilters] = useState<MethodologyListFilters>({})
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch methodologies from backend
  useEffect(() => {
    async function loadMethodologies() {
      try {
        setLoading(true)

        // Build query params
        const params = new URLSearchParams()
        if (filters.type) params.append('type', filters.type)
        if (filters.category) params.append('category', filters.category)
        if (filters.standard) params.append('standard', filters.standard)
        if (filters.status) params.append('status', filters.status)
        if (searchQuery) params.append('search', searchQuery)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/methodologies?${params.toString()}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch methodologies: ${response.statusText}`)
        }

        const data = await response.json()

        setMethodologies(data.methodologies || [])
        setIsMockData(true) // For now, all data is mock
      } catch (err) {
        console.error('Failed to load methodologies:', err)
        setError(
          'Failed to load methodologies. Please check if the backend is running on port 8000.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadMethodologies()
  }, [filters, searchQuery])

  const handleSelectMethodology = (methodology: Methodology) => {
    setSelectedMethodology(methodology)
    setShowUpload(false)
  }

  const handleUploadMode = () => {
    setShowUpload(true)
    setSelectedMethodology(null)
  }

  return (
    <div className="space-y-6">
      {/* Mock Data Badge */}
      {isMockData && (
        <Alert variant="default">
          <Info className="h-4 w-4" />
          <AlertTitle>Mock Data</AlertTitle>
          <AlertDescription>
            Currently showing mock methodologies. Guardian integration coming soon.
          </AlertDescription>
        </Alert>
      )}

      {/* Explainer */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Methodology Selection</AlertTitle>
        <AlertDescription>
          Select an existing digitized methodology or upload a document to create a new one.
          Methodologies define the structure, schemas, and policy steps for Islamic finance workflows.
        </AlertDescription>
      </Alert>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error Loading Methodologies</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters Bar */}
      {!loading && !error && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <CardTitle className="text-base">Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <Input
              placeholder="Search methodologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Type Filter Buttons */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Type</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!filters.type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, type: undefined })}
                >
                  All
                </Button>
                <Button
                  variant={filters.type === 'islamic-finance' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, type: 'islamic-finance' })}
                >
                  Islamic Finance
                </Button>
                <Button
                  variant={filters.type === 'environmental' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, type: 'environmental' })}
                >
                  Environmental
                </Button>
                <Button
                  variant={filters.type === 'social' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, type: 'social' })}
                >
                  Social
                </Button>
              </div>
            </div>

            {/* Status Filter Buttons */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Status</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!filters.status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, status: undefined })}
                >
                  All
                </Button>
                <Button
                  variant={filters.status === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, status: 'active' })}
                >
                  Active
                </Button>
                <Button
                  variant={filters.status === 'draft' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, status: 'draft' })}
                >
                  Draft
                </Button>
                <Button
                  variant={filters.status === 'archived' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, status: 'archived' })}
                >
                  Archived
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading methodologies...</span>
        </div>
      )}

      {/* Split Panel: Methodology Cards (Left) + Preview (Right) */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Methodology Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Available Methodologies ({methodologies.length})
              </h3>
              <Button variant="outline" size="sm" onClick={handleUploadMode}>
                <Upload className="h-4 w-4 mr-2" />
                Upload New
              </Button>
            </div>

            {/* Methodology List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {methodologies.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No methodologies found matching your filters.
                  </CardContent>
                </Card>
              ) : (
                methodologies.map((methodology) => (
                  <MethodologyCard
                    key={methodology.id}
                    methodology={methodology}
                    selected={selectedMethodology?.id === methodology.id}
                    onClick={() => handleSelectMethodology(methodology)}
                    showStats={true}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Preview */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            {selectedMethodology ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">
                      {selectedMethodology.category === 'mudarabah'
                        ? '🤝'
                        : selectedMethodology.category === 'sukuk'
                        ? '📜'
                        : '📋'}
                    </span>
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2">{selectedMethodology.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {selectedMethodology.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-md">
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="text-sm font-medium capitalize">{selectedMethodology.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="text-sm font-medium capitalize">
                        {selectedMethodology.category || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Standard</p>
                      <p className="text-sm font-medium">{selectedMethodology.standard || 'Custom'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge variant={selectedMethodology.status === 'active' ? 'default' : 'secondary'}>
                        {selectedMethodology.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Guardian Components */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedMethodology.schemaCount}</span>
                      <span className="text-muted-foreground">data schemas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedMethodology.policySteps}</span>
                      <span className="text-muted-foreground">policy workflow steps</span>
                    </div>
                  </div>

                  {/* Required Roles */}
                  {selectedMethodology.requiredRoles.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Required Roles</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedMethodology.requiredRoles.map((role, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Statistics */}
                  {selectedMethodology.applicationCount > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Performance</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Applications</p>
                          <p className="text-lg font-semibold">{selectedMethodology.applicationCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Success Rate</p>
                          <p className="text-lg font-semibold">
                            {(selectedMethodology.successRate * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground">Avg. Validation Time</p>
                          <p className="text-sm font-medium">
                            {Math.floor(selectedMethodology.averageValidationTime / 60)} min{' '}
                            {selectedMethodology.averageValidationTime % 60} sec
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button className="w-full" size="lg">
                    Apply This Methodology
                  </Button>
                </CardContent>
              </Card>
            ) : showUpload ? (
              <MethodologyUploadFlow />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Methodology Preview</CardTitle>
                  <CardDescription>
                    Select a methodology from the left to see details, or click "Upload New" to
                    digitize a new methodology
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <FileCheck className="h-12 w-12" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
