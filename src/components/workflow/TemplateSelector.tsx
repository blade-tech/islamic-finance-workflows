'use client'

/**
 * TEMPLATE SELECTOR
 * =================
 * Standalone component for selecting Islamic finance templates.
 *
 * WHAT THIS DOES:
 * - Lists all available templates (Sukuk, Murabaha, Ijarah, etc.)
 * - Allows selection of existing template OR
 * - Allows upload of document to create new template
 * - Shows detailed preview of selected template
 * - Filters by type, category, standard, status
 *
 * USER-FACING TERMINOLOGY:
 * - "Templates" (not "methodologies")
 * - "Workflows" (not "policies")
 * - "ZeroH" platform (Guardian hidden)
 * - Standards (AAOIFI, IIFM) mentioned by name
 * - No mention of "Guardian", "HCS", "Hedera" except when explaining blockchain
 *
 * BASED ON:
 * - Hedera Guardian methodology digitization framework (hidden from users)
 * - Step2WorkflowSelection component pattern
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Info, Loader2, Upload, FileCheck, Users, Clock, Filter, CheckCircle } from 'lucide-react'
import { TemplateCard } from './TemplateCard'
import { TemplateUploadFlow } from './TemplateUploadFlow'
import type { Methodology, MethodologyListFilters } from '@/lib/types'

interface TemplateSelectorProps {
  /** Optional controlled selected templates (for integration with workflow) */
  selectedTemplates?: Methodology[]
  /** Optional callback when selection changes (for integration with workflow) */
  onSelectionChange?: (templates: Methodology[]) => void
  /** Whether to show action buttons (Apply/Combine) - hide when controlled */
  showActionButtons?: boolean
}

export function TemplateSelector({
  selectedTemplates: controlledSelection,
  onSelectionChange,
  showActionButtons = false,
}: TemplateSelectorProps = {}) {
  const [templates, setTemplates] = useState<Methodology[]>([])

  // Use controlled selection if provided, otherwise use internal state
  const [internalSelection, setInternalSelection] = useState<Methodology[]>([])
  const selectedTemplates = controlledSelection !== undefined ? controlledSelection : internalSelection

  // Create wrapper function to handle both controlled and uncontrolled state updates
  const setSelectedTemplates = (update: Methodology[] | ((prev: Methodology[]) => Methodology[])) => {
    if (onSelectionChange) {
      // Controlled mode: resolve function and call onSelectionChange with new value
      const newValue = typeof update === 'function' ? update(selectedTemplates) : update
      onSelectionChange(newValue)
    } else {
      // Uncontrolled mode: use internal state setter
      setInternalSelection(update)
    }
  }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMockData, setIsMockData] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  // Filters
  const [filters, setFilters] = useState<MethodologyListFilters>({})
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch templates from backend
  useEffect(() => {
    async function loadTemplates() {
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
          throw new Error(`Failed to fetch templates: ${response.statusText}`)
        }

        const data = await response.json()

        setTemplates(data.methodologies || [])
        setIsMockData(true) // For now, all data is mock
      } catch (err) {
        console.error('Failed to load templates:', err)
        setError(
          'Failed to load templates. Please check if the backend is running on port 8000.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [filters, searchQuery])

  const handleToggleTemplate = (template: Methodology) => {
    setSelectedTemplates((prev) => {
      const exists = prev.find((m) => m.id === template.id)
      if (exists) {
        return prev.filter((m) => m.id !== template.id)
      } else {
        return [...prev, template]
      }
    })
    setShowUpload(false)
  }

  const handleUploadMode = () => {
    setShowUpload(true)
  }

  const handleClearSelection = () => {
    setSelectedTemplates([])
  }

  return (
    <div className="space-y-6">
      {/* Mock Data Badge */}
      {isMockData && (
        <Alert variant="default">
          <Info className="h-4 w-4" />
          <AlertTitle>Preview Mode</AlertTitle>
          <AlertDescription>
            Currently showing sample templates. Full template library coming soon.
          </AlertDescription>
        </Alert>
      )}

      {/* Explainer */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Template Selection</AlertTitle>
        <AlertDescription>
          Select a template for your Islamic finance workflow. All templates are AAOIFI-compliant
          and ready for execution on Hedera Blockchain.
        </AlertDescription>
      </Alert>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error Loading Templates</AlertTitle>
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
              placeholder="Search templates..."
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
          <span className="ml-2 text-muted-foreground">Loading templates...</span>
        </div>
      )}

      {/* Split Panel: Template Cards (Left) + Preview (Right) */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Template Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Available Templates ({templates.length})
                </h3>
                {selectedTemplates.length > 0 && (
                  <Badge variant="default">{selectedTemplates.length} selected</Badge>
                )}
              </div>
              <div className="flex gap-2">
                {selectedTemplates.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearSelection}>
                    Clear Selection
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleUploadMode}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New
                </Button>
              </div>
            </div>

            {/* Template List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {templates.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No templates found matching your filters.
                  </CardContent>
                </Card>
              ) : (
                templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    selected={selectedTemplates.some((m) => m.id === template.id)}
                    onClick={() => handleToggleTemplate(template)}
                    showStats={true}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Preview */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            {selectedTemplates.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedTemplates.length === 1
                      ? selectedTemplates[0].name
                      : `Combined Templates (${selectedTemplates.length})`}
                  </CardTitle>
                  <CardDescription>
                    {selectedTemplates.length === 1
                      ? selectedTemplates[0].description
                      : `Selected ${selectedTemplates.length} templates to combine into workflow`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Templates List */}
                  {selectedTemplates.length > 1 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">Selected Templates:</p>
                      <div className="space-y-1">
                        {selectedTemplates.map((m) => (
                          <div key={m.id} className="text-sm flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{m.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Combined Components */}
                  <div className="p-4 bg-muted rounded-md space-y-3">
                    <p className="text-xs text-muted-foreground font-medium">Combined Components:</p>
                    <div className="flex items-center gap-2 text-sm">
                      <FileCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedTemplates.reduce((sum, m) => sum + m.schemaCount, 0)}
                      </span>
                      <span className="text-muted-foreground">total data schemas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedTemplates.reduce((sum, m) => sum + m.policySteps, 0)}
                      </span>
                      <span className="text-muted-foreground">total workflow steps</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {
                          new Set(
                            selectedTemplates.flatMap((m) => m.requiredRoles)
                          ).size
                        }
                      </span>
                      <span className="text-muted-foreground">unique roles required</span>
                    </div>
                  </div>

                  {/* All Required Roles */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">All Required Roles</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(
                        new Set(selectedTemplates.flatMap((m) => m.requiredRoles))
                      ).map((role, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button (only show in standalone mode) */}
                  {showActionButtons && (
                    <Button className="w-full" size="lg">
                      {selectedTemplates.length === 1
                        ? 'Apply This Template'
                        : `Combine ${selectedTemplates.length} Templates`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : showUpload ? (
              <TemplateUploadFlow />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Template Preview</CardTitle>
                  <CardDescription>
                    Select a template from the left to see details, or click "Upload New" to
                    create a new template
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
