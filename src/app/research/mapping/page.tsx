'use client'

/**
 * OBLIGATION-CONTROL MAPPING VISUALIZATION
 * ========================================
 * Shows how regulatory obligations map to operational controls.
 * Visual representation of activation logic and relationships.
 */

import { useState } from 'react'
import Link from 'next/link'
import { useGRCStore } from '@/lib/grc-store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  GitBranch,
  ArrowRight,
  Shield,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Filter,
  ArrowDown
} from 'lucide-react'
import type { QatarRegulator } from '@/lib/grc-types'

export default function MappingPage() {
  const { obligations, controls, selectedRegulators, setSelectedRegulators } = useGRCStore()
  const [filterRegulator, setFilterRegulator] = useState<'ALL' | QatarRegulator>('ALL')
  const [filterCategory, setFilterCategory] = useState<string>('ALL')

  // Filter obligations based on selected regulator
  const filteredObligations = obligations.filter(obl => {
    if (filterRegulator === 'ALL') return true
    return obl.applicability.includes(filterRegulator)
  }).filter(obl => {
    if (filterCategory === 'ALL') return true
    return obl.category === filterCategory
  })

  // Get controls for an obligation
  const getControlsForObligation = (obligationId: string) => {
    return controls.filter(ctrl => ctrl.related_obligations.includes(obligationId))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Obligation-Control Mapping</h1>
        <p className="text-muted-foreground mt-2">
          Visual representation of how regulatory obligations activate operational controls
        </p>
      </div>

      {/* Back Button */}
      <div>
        <Button variant="outline" asChild>
          <Link href="/research">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Research Hub
          </Link>
        </Button>
      </div>

      {/* Activation Flow Visualization */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <GitBranch className="w-6 h-6" />
            How Activation Works
          </CardTitle>
          <CardDescription className="text-blue-700">
            Visual flow showing how regulator selection activates obligations and controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Flow Diagram */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="space-y-6">
              {/* QCB Flow */}
              <div className="flex items-center gap-4">
                <div className="w-32 text-center">
                  <Badge variant="outline" className="bg-blue-600 text-white">QCB Selected</Badge>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-600" />
                <div className="flex-1 bg-blue-50 p-3 rounded border border-blue-200">
                  <div className="font-semibold text-sm">46 QCB Obligations Activated</div>
                  <div className="text-xs text-muted-foreground mt-1">All obligations where applicability includes 'QCB'</div>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-600" />
                <div className="w-48 bg-blue-100 p-3 rounded border border-blue-300">
                  <div className="font-semibold text-sm">31 Controls Active</div>
                  <div className="text-xs text-muted-foreground mt-1">26 universal + 5 QCB-specific</div>
                </div>
              </div>

              {/* QFCRA Flow */}
              <div className="flex items-center gap-4">
                <div className="w-32 text-center">
                  <Badge variant="outline" className="bg-purple-600 text-white">QFCRA Selected</Badge>
                </div>
                <ArrowRight className="w-6 h-6 text-purple-600" />
                <div className="flex-1 bg-purple-50 p-3 rounded border border-purple-200">
                  <div className="font-semibold text-sm">28 QFCRA Obligations Activated</div>
                  <div className="text-xs text-muted-foreground mt-1">All obligations where applicability includes 'QFCRA'</div>
                </div>
                <ArrowRight className="w-6 h-6 text-purple-600" />
                <div className="w-48 bg-purple-100 p-3 rounded border border-purple-300">
                  <div className="font-semibold text-sm">29 Controls Active</div>
                  <div className="text-xs text-muted-foreground mt-1">26 universal + 3 QFCRA-specific</div>
                </div>
              </div>

              {/* Both Flow */}
              <div className="flex items-center gap-4">
                <div className="w-32 text-center">
                  <Badge variant="outline" className="bg-green-600 text-white">Both Selected</Badge>
                </div>
                <ArrowRight className="w-6 h-6 text-green-600" />
                <div className="flex-1 bg-green-50 p-3 rounded border border-green-200">
                  <div className="font-semibold text-sm">60 Unified Obligations Activated</div>
                  <div className="text-xs text-muted-foreground mt-1">All obligations (duplicates merged)</div>
                </div>
                <ArrowRight className="w-6 h-6 text-green-600" />
                <div className="w-48 bg-green-100 p-3 rounded border border-green-300">
                  <div className="font-semibold text-sm">All 34 Controls Active</div>
                  <div className="text-xs text-muted-foreground mt-1">Complete control coverage</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activation Logic Code */}
          <div className="bg-white p-4 rounded-lg border font-mono text-sm">
            <div className="text-blue-600 mb-2">// TypeScript Activation Logic</div>
            <div className="space-y-1">
              <div>
                <span className="text-blue-600">const</span> activeControls = controls.<span className="text-purple-600">filter</span>(ctrl =&gt; {'{'}
              </div>
              <div className="ml-4">
                <span className="text-blue-600">if</span> (selectedRegulators.<span className="text-purple-600">includes</span>(<span className="text-amber-600">'QCB'</span>) && ctrl.qcb_required) <span className="text-blue-600">return true</span>
              </div>
              <div className="ml-4">
                <span className="text-blue-600">if</span> (selectedRegulators.<span className="text-purple-600">includes</span>(<span className="text-amber-600">'QFCRA'</span>) && ctrl.qfcra_required) <span className="text-blue-600">return true</span>
              </div>
              <div className="ml-4">
                <span className="text-blue-600">return false</span>
              </div>
              <div>{'}'});</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Mapping View
              </CardTitle>
              <CardDescription>Filter by regulator or category to see specific mappings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={filterRegulator} onValueChange={(v) => setFilterRegulator(v as any)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by regulator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Regulators</SelectItem>
                <SelectItem value="QCB">QCB Only</SelectItem>
                <SelectItem value="QFCRA">QFCRA Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v)}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="SSB_GOVERNANCE">SSB Governance</SelectItem>
                <SelectItem value="SNCR_MANAGEMENT">SNCR Management</SelectItem>
                <SelectItem value="PRODUCT_APPROVAL">Product Approval</SelectItem>
                <SelectItem value="RISK_MANAGEMENT">Risk Management</SelectItem>
                <SelectItem value="REPORTING">Reporting</SelectItem>
                <SelectItem value="INTERNAL_CONTROLS">Internal Controls</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              Showing {filteredObligations.length} obligations
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Obligation-Control Mapping Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Mapping</CardTitle>
          <CardDescription>
            Each obligation and the controls it activates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredObligations.map(obligation => {
            const relatedControls = getControlsForObligation(obligation.id)

            return (
              <Card key={obligation.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Obligation Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{obligation.id}</Badge>
                          {obligation.applicability.map(reg => (
                            <Badge
                              key={reg}
                              variant="outline"
                              className={reg === 'QCB' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}
                            >
                              {reg}
                            </Badge>
                          ))}
                          <Badge variant="secondary">{obligation.category.replace(/_/g, ' ')}</Badge>
                        </div>
                        <div className="font-semibold">{obligation.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{obligation.requirement}</div>
                      </div>
                    </div>

                    {/* Mapping Arrow */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pl-4">
                      <ArrowDown className="w-4 h-4" />
                      <span>Activates {relatedControls.length} control(s)</span>
                    </div>

                    {/* Related Controls */}
                    <div className="pl-4 space-y-2">
                      {relatedControls.map(control => (
                        <div key={control.id} className="flex items-start gap-3 bg-muted p-3 rounded">
                          <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">{control.id}</Badge>
                              <span className="font-medium text-sm">{control.name}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{control.description}</div>
                            <div className="flex gap-2 mt-2">
                              {control.qcb_required && (
                                <Badge variant="outline" className="text-xs bg-blue-50">QCB Required</Badge>
                              )}
                              {control.qfcra_required && (
                                <Badge variant="outline" className="text-xs bg-purple-50">QFCRA Required</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {relatedControls.length === 0 && (
                        <div className="text-xs text-muted-foreground italic pl-3">
                          No controls directly mapped (may be covered by related obligations)
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {/* Conflict Resolution Examples */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Conflict Resolution Examples
          </CardTitle>
          <CardDescription className="text-amber-700">
            Real examples of how conflicts between QCB and QFCRA were resolved
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Example 1: SSB Position Limits */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="font-semibold mb-2">Example 1: SSB Member Position Limits</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-900 mb-1">QCB Requirement</div>
                  <div className="text-xs">Scholar can hold maximum 3 SSB positions</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-semibold text-purple-900 mb-1">QFCRA Requirement</div>
                  <div className="text-xs">No position limit specified</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-semibold text-green-900 mb-1">Resolution</div>
                  <div className="text-xs">✓ Use QCB rule (strictest requirement)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example 2: SSB Meeting Frequency */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="font-semibold mb-2">Example 2: SSB Meeting Frequency</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-900 mb-1">QCB Requirement</div>
                  <div className="text-xs">Quarterly meetings minimum</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-semibold text-purple-900 mb-1">QFCRA Requirement</div>
                  <div className="text-xs">Semi-annual meetings minimum</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-semibold text-green-900 mb-1">Resolution</div>
                  <div className="text-xs">✓ Use QCB rule (more frequent = stricter)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Link to Full Conflict Matrix */}
          <div className="text-center">
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Complete Conflict Resolution Matrix (14 conflicts)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
