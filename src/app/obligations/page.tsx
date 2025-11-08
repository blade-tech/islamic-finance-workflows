'use client'

/**
 * OBLIGATIONS PAGE
 * ================
 * Qatar regulatory obligations register with full transparency.
 * Shows HOW the system works - not a black box.
 *
 * Features:
 * - Regulator selection (QCB/QFCRA/Both)
 * - Filtering by category, status, priority
 * - Source documentation links
 * - Control relationship traceability
 * - Research transparency panel
 */

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useGRCStore } from '@/lib/grc-store'
import type { QatarRegulator, ObligationCategory, ComplianceStatus, Obligation } from '@/lib/grc-types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  BookOpen,
  FileText,
  ExternalLink,
  Target,
  Info,
  Search,
  FileCheck,
  ChevronRight,
} from 'lucide-react'

export default function ObligationsPage() {
  const {
    selectedRegulators,
    setSelectedRegulators,
    getFilteredObligations,
    updateObligationStatus,
    getControlById,
  } = useGRCStore()

  const [categoryFilter, setCategoryFilter] = useState<ObligationCategory | 'ALL'>('ALL')
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredObligations = useMemo(() => {
    let obligations = getFilteredObligations()

    if (categoryFilter !== 'ALL') {
      obligations = obligations.filter(obl => obl.category === categoryFilter)
    }

    if (statusFilter !== 'ALL') {
      obligations = obligations.filter(obl => obl.compliance_status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      obligations = obligations.filter(obl =>
        obl.title.toLowerCase().includes(query) ||
        obl.requirement.toLowerCase().includes(query) ||
        obl.id.toLowerCase().includes(query)
      )
    }

    return obligations
  }, [getFilteredObligations, categoryFilter, statusFilter, searchQuery])

  const handleRegulatorToggle = (regulator: QatarRegulator) => {
    if (selectedRegulators.includes(regulator)) {
      const newSelection = selectedRegulators.filter(r => r !== regulator)
      if (newSelection.length > 0) {
        setSelectedRegulators(newSelection)
      }
    } else {
      setSelectedRegulators([...selectedRegulators, regulator])
    }
  }

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case 'COMPLIANT':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'NEEDS_ATTENTION':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Shield className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadgeVariant = (status: ComplianceStatus) => {
    switch (status) {
      case 'COMPLIANT':
        return 'default'
      case 'NEEDS_ATTENTION':
        return 'destructive'
      case 'IN_PROGRESS':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
      case 'HIGH':
        return 'destructive'
      case 'MEDIUM':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Qatar Obligations Register</h1>
          <p className="text-muted-foreground mt-2">
            Manage regulatory obligations for QCB and QFCRA compliance
          </p>
        </div>
      </div>

      {/* TRANSPARENCY PANEL - How This Works */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <CardTitle className="text-blue-900">
                🔍 How This Works: Complete Transparency
              </CardTitle>
              <CardDescription className="text-blue-700 mt-2">
                This register is built from comprehensive research of Qatar's dual regulatory framework.
                Nothing is hidden - all data sources and mapping logic are visible.
              </CardDescription>
              <div className="mt-4 space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <strong>QCB (Qatar Central Bank):</strong> 46 obligations extracted from QCB Law 13/2012, Circulars, and Instructions to Banks
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <strong>QFCRA (Qatar Financial Centre):</strong> 28 obligations from ISFI Rulebook and QFCRA regulations
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <strong>Unified:</strong> Merged to 60 obligations (14 duplicates resolved with conflict analysis)
                </div>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="bg-white" asChild>
                  <Link href="/research">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Research Documents
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="bg-white" asChild>
                  <Link href="/research/mapping">
                    <Target className="w-4 h-4 mr-2" />
                    See Mapping Diagram
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="bg-white" asChild>
                  <Link href="/research/methodology">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Research Methodology
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Jurisdiction Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Select Jurisdiction</CardTitle>
          <CardDescription>
            Choose your regulatory jurisdiction for GRC compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Qatar - Ready */}
            <Card className="border-2 border-green-500 bg-green-50 cursor-pointer hover:border-green-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                      🇶🇦
                    </div>
                    <div>
                      <div className="font-bold text-lg">Qatar</div>
                      <Badge variant="default" className="bg-green-600 mt-1">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Ready
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-3 space-y-1">
                  <div>✓ 60 unified obligations</div>
                  <div>✓ 34 controls mapped</div>
                  <div>✓ QCB + QFCRA</div>
                </div>
              </CardContent>
            </Card>

            {/* UAE - Coming Soon */}
            <Card className="border-2 border-gray-200 bg-gray-50 opacity-60">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                      🇦🇪
                    </div>
                    <div>
                      <div className="font-bold text-lg">UAE</div>
                      <Badge variant="secondary" className="mt-1">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-3 space-y-1">
                  <div>CBUAE + DFSA</div>
                  <div>ADGM + DIFC</div>
                </div>
              </CardContent>
            </Card>

            {/* Saudi Arabia - Coming Soon */}
            <Card className="border-2 border-gray-200 bg-gray-50 opacity-60">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                      🇸🇦
                    </div>
                    <div>
                      <div className="font-bold text-lg">Saudi Arabia</div>
                      <Badge variant="secondary" className="mt-1">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-3 space-y-1">
                  <div>SAMA</div>
                  <div>CMA</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Qatar Regulator Details (Expanded) */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 space-y-3">
              <div className="font-semibold text-sm">Qatar Regulators (Active):</div>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRegulators.includes('QCB')}
                    onChange={() => handleRegulatorToggle('QCB')}
                    className="w-4 h-4"
                  />
                  <Badge variant="outline" className="text-sm bg-white">
                    QCB (Qatar Central Bank)
                  </Badge>
                  <span className="text-xs text-muted-foreground">46 obligations</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRegulators.includes('QFCRA')}
                    onChange={() => handleRegulatorToggle('QFCRA')}
                    className="w-4 h-4"
                  />
                  <Badge variant="outline" className="text-sm bg-white">
                    QFCRA (Qatar Financial Centre)
                  </Badge>
                  <span className="text-xs text-muted-foreground">28 obligations</span>
                </label>
              </div>

              {selectedRegulators.length === 2 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                  <strong>Both Regulators Selected:</strong> When conflicting requirements exist, the strictest requirement is applied.
                  <Link href="/research/conflicts" className="ml-2 text-blue-600 hover:underline">
                    View conflict resolution rules →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-[200px] max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search obligations..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="SSB_GOVERNANCE">SSB Governance</SelectItem>
            <SelectItem value="SNCR_MANAGEMENT">SNCR Management</SelectItem>
            <SelectItem value="PRODUCT_APPROVAL">Product Approval</SelectItem>
            <SelectItem value="REPORTING">Reporting</SelectItem>
            <SelectItem value="RISK_MANAGEMENT">Risk Management</SelectItem>
            <SelectItem value="INTERNAL_CONTROLS">Internal Controls</SelectItem>
            <SelectItem value="AML_CFT">AML/CFT</SelectItem>
            <SelectItem value="AUDIT">Audit</SelectItem>
            <SelectItem value="DISCLOSURE">Disclosure</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="COMPLIANT">Compliant</SelectItem>
            <SelectItem value="NEEDS_ATTENTION">Needs Attention</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="NOT_APPLICABLE">Not Applicable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Obligations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{filteredObligations.length}</strong> of <strong>{getFilteredObligations().length}</strong> obligations
            {selectedRegulators.length === 1 && (
              <span className="ml-2">for {selectedRegulators[0]}</span>
            )}
            {selectedRegulators.length === 2 && (
              <span className="ml-2">(unified view)</span>
            )}
          </p>
        </div>

        {filteredObligations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No obligations match your filters.</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => {
                  setCategoryFilter('ALL')
                  setStatusFilter('ALL')
                  setSearchQuery('')
                }}
              >
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredObligations.map(obligation => (
          <Card key={obligation.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {getStatusIcon(obligation.compliance_status)}
                    <CardTitle className="text-lg">{obligation.title}</CardTitle>

                    {/* Priority Badge */}
                    <Badge variant={getPriorityBadgeVariant(obligation.priority)}>
                      {obligation.priority}
                    </Badge>

                    {/* Research Source Badge */}
                    <Badge variant="secondary" className="gap-1 cursor-help" title={`Source: ${obligation.source.document} ${obligation.source.section}`}>
                      <FileCheck className="w-3 h-3" />
                      {obligation.source.regulator}
                    </Badge>
                  </div>

                  <div className="flex gap-2 mb-3 flex-wrap">
                    {/* Applicability Badges */}
                    {obligation.applicability.map(reg => (
                      <Badge key={reg} variant="outline">{reg}</Badge>
                    ))}

                    {/* Category Badge */}
                    <Badge>{obligation.category.replace(/_/g, ' ')}</Badge>

                    {/* Frequency Badge */}
                    <Badge variant="secondary">{obligation.frequency}</Badge>

                    {/* Status Badge */}
                    <Badge variant={getStatusBadgeVariant(obligation.compliance_status)}>
                      {obligation.compliance_status.replace(/_/g, ' ')}
                    </Badge>
                  </div>

                  <CardDescription className="text-sm leading-relaxed">
                    {obligation.requirement}
                  </CardDescription>

                  {/* Notes */}
                  {obligation.notes && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                      <strong>Implementation Note:</strong> {obligation.notes}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {/* Related Controls */}
                <AccordionItem value="controls">
                  <AccordionTrigger className="text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>This obligation activates <strong>{obligation.related_controls.length}</strong> controls</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {obligation.related_controls.map(controlId => {
                        const control = getControlById(controlId)
                        if (!control) return null
                        return (
                          <div key={controlId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{control.id}</Badge>
                                <span className="text-sm font-medium">{control.name}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{control.description}</p>
                            </div>
                            <Button variant="link" size="sm" asChild>
                              <Link href={`/controls?highlight=${controlId}`}>
                                View control <ChevronRight className="w-4 h-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Evidence Required */}
                <AccordionItem value="evidence">
                  <AccordionTrigger className="text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Evidence required: <strong>{obligation.evidence_required.length}</strong> items</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1 pt-2">
                      {obligation.evidence_required.map((evidence, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          <span>{evidence}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Source Documentation */}
                <AccordionItem value="source">
                  <AccordionTrigger className="text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Research source documentation</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-muted-foreground">Regulator:</span>
                          <Badge variant="outline" className="ml-2">{obligation.source.regulator}</Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Effective Date:</span>
                          <span className="ml-2">{obligation.effective_date}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Source Document:</span>
                        <span className="ml-2">{obligation.source.document}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Section:</span>
                        <span className="ml-2">{obligation.source.section}</span>
                      </div>
                      {obligation.source.url && (
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <Link href={obligation.source.url}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View source document
                          </Link>
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Status Update Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  size="sm"
                  variant={obligation.compliance_status === 'COMPLIANT' ? 'default' : 'outline'}
                  onClick={() => updateObligationStatus(obligation.id, 'COMPLIANT')}
                >
                  Mark Compliant
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateObligationStatus(obligation.id, 'IN_PROGRESS')}
                >
                  In Progress
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateObligationStatus(obligation.id, 'NEEDS_ATTENTION')}
                >
                  Needs Attention
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
