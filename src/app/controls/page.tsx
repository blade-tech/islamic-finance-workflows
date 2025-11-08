'use client'

/**
 * CONTROLS PAGE
 * =============
 * Control library with activation logic transparency.
 * Shows exactly WHY controls are activated based on regulator selection.
 *
 * Features:
 * - Activation logic visualization
 * - Control testing simulation
 * - Obligation traceability
 * - Test history tracking
 */

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useGRCStore } from '@/lib/grc-store'
import type { QatarRegulator, ControlBucket, TestResult } from '@/lib/grc-types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Shield,
  CheckCircle2,
  XCircle,
  Play,
  Code2,
  Target,
  FileText,
  ChevronRight,
  Calendar,
  AlertTriangle,
} from 'lucide-react'

export default function ControlsPage() {
  const {
    selectedRegulators,
    setSelectedRegulators,
    getActiveControls,
    controls,
    executeControlTest,
  } = useGRCStore()

  const [bucketFilter, setBucketFilter] = useState<ControlBucket | 'ALL'>('ALL')
  const [testStatusFilter, setTestStatusFilter] = useState<'ALL' | 'TESTED' | 'UNTESTED'>('ALL')

  const activeControls = useMemo(() => {
    let filtered = getActiveControls()

    if (bucketFilter !== 'ALL') {
      filtered = filtered.filter(ctrl => ctrl.bucket === bucketFilter)
    }

    if (testStatusFilter === 'TESTED') {
      filtered = filtered.filter(ctrl => ctrl.last_test_result && ctrl.last_test_result !== 'NOT_TESTED')
    } else if (testStatusFilter === 'UNTESTED') {
      filtered = filtered.filter(ctrl => !ctrl.last_test_result || ctrl.last_test_result === 'NOT_TESTED')
    }

    return filtered
  }, [getActiveControls, bucketFilter, testStatusFilter])

  const stats = useMemo(() => {
    const qcbControls = controls.filter(c => c.qcb_required).length
    const qfcraControls = controls.filter(c => c.qfcra_required).length
    const universalControls = controls.filter(c => c.qcb_required && c.qfcra_required).length
    const passedControls = activeControls.filter(c => c.last_test_result === 'PASS').length
    const failedControls = activeControls.filter(c => c.last_test_result === 'FAIL').length
    const untestedControls = activeControls.filter(c => !c.last_test_result || c.last_test_result === 'NOT_TESTED').length

    return {
      total: controls.length,
      qcbControls,
      qfcraControls,
      universalControls,
      active: activeControls.length,
      passedControls,
      failedControls,
      untestedControls,
    }
  }, [controls, activeControls])

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

  const handleExecuteTest = (controlId: string) => {
    // Simulate test execution (90% pass rate for demo)
    const result: TestResult = Math.random() > 0.1 ? 'PASS' : 'FAIL'
    executeControlTest(controlId, result, 'Automated test execution')
  }

  const getTestResultIcon = (result?: TestResult) => {
    switch (result) {
      case 'PASS':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'FAIL':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Shield className="w-5 h-5 text-gray-400" />
    }
  }

  const getTestResultBadge = (result?: TestResult) => {
    switch (result) {
      case 'PASS':
        return <Badge variant="default" className="bg-green-600">PASS</Badge>
      case 'FAIL':
        return <Badge variant="destructive">FAIL</Badge>
      default:
        return <Badge variant="secondary">NOT TESTED</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Control Library</h1>
          <p className="text-muted-foreground mt-2">
            Manage and execute compliance controls with full activation transparency
          </p>
        </div>
      </div>

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
            <Card className="border-2 border-green-500 bg-green-50">
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
        </CardContent>
      </Card>

      {/* TRANSPARENCY PANEL - Activation Logic */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center gap-2">
            <Code2 className="w-6 h-6" />
            Control Activation Logic: How It Works
          </CardTitle>
          <CardDescription className="text-green-700 mt-2">
            Controls are automatically activated based on your regulator selection. Here's the exact logic:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code Example */}
          <div className="bg-white rounded-lg p-4 border font-mono text-sm">
            <div className="text-green-600 mb-2">// Activation Logic (TypeScript)</div>
            <div className="space-y-1">
              <div>
                <span className="text-blue-600">if</span> (selectedRegulators.<span className="text-purple-600">includes</span>(<span className="text-amber-600">'QCB'</span>) && control.qcb_required) {'{'}
              </div>
              <div className="ml-4">
                <span className="text-blue-600">activate</span>(control) <span className="text-green-600">// QCB requires this control</span>
              </div>
              <div>{'}'}</div>
              <div className="mt-2">
                <span className="text-blue-600">if</span> (selectedRegulators.<span className="text-purple-600">includes</span>(<span className="text-amber-600">'QFCRA'</span>) && control.qfcra_required) {'{'}
              </div>
              <div className="ml-4">
                <span className="text-blue-600">activate</span>(control) <span className="text-green-600">// QFCRA requires this control</span>
              </div>
              <div>{'}'}</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-700">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total Controls</div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.qcbControls}</div>
                <div className="text-xs text-muted-foreground">QCB-Required</div>
                <div className="text-xs text-blue-600 mt-1">
                  {selectedRegulators.includes('QCB') ? '✓ Active' : '○ Inactive'}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.qfcraControls}</div>
                <div className="text-xs text-muted-foreground">QFCRA-Required</div>
                <div className="text-xs text-purple-600 mt-1">
                  {selectedRegulators.includes('QFCRA') ? '✓ Active' : '○ Inactive'}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.universalControls}</div>
                <div className="text-xs text-muted-foreground">Both Regulators</div>
                <div className="text-xs text-green-600 mt-1">Universal</div>
              </CardContent>
            </Card>
          </div>

          {/* Current Activation Status */}
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm font-semibold mb-2">Current Activation:</div>
            <div className="flex gap-2 items-center">
              <span className="text-sm">Selected:</span>
              {selectedRegulators.map(reg => (
                <Badge key={reg} variant="outline">{reg}</Badge>
              ))}
              <span className="text-sm mx-2">→</span>
              <span className="text-sm"><strong>{stats.active}</strong> controls activated</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulator Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Scope</CardTitle>
          <CardDescription>
            Toggle regulators to see controls activate/deactivate in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedRegulators.includes('QCB')}
              onChange={() => handleRegulatorToggle('QCB')}
              className="w-4 h-4"
            />
            <Badge variant="outline" className="text-sm">
              QCB (Qatar Central Bank)
            </Badge>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedRegulators.includes('QFCRA')}
              onChange={() => handleRegulatorToggle('QFCRA')}
              className="w-4 h-4"
            />
            <Badge variant="outline" className="text-sm">
              QFCRA (Qatar Financial Centre)
            </Badge>
          </label>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <Select value={bucketFilter} onValueChange={(v) => setBucketFilter(v as any)}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by bucket" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Buckets</SelectItem>
            <SelectItem value="governance">Governance</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="shariah">Shariah</SelectItem>
          </SelectContent>
        </Select>

        <Select value={testStatusFilter} onValueChange={(v) => setTestStatusFilter(v as any)}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by test status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Test Statuses</SelectItem>
            <SelectItem value="TESTED">Tested Only</SelectItem>
            <SelectItem value="UNTESTED">Untested Only</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-2 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>{stats.passedControls} Passed</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span>{stats.failedControls} Failed</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-gray-400" />
            <span>{stats.untestedControls} Untested</span>
          </div>
        </div>
      </div>

      {/* Controls List */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Showing <strong>{activeControls.length}</strong> active controls
        </p>

        {activeControls.map(control => (
          <Card key={control.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {getTestResultIcon(control.last_test_result)}
                    <CardTitle className="text-lg">{control.name}</CardTitle>
                    <Badge variant="outline">{control.id}</Badge>
                    {getTestResultBadge(control.last_test_result)}
                  </div>

                  <div className="flex gap-2 mb-3 flex-wrap">
                    {/* Bucket Badge */}
                    <Badge>{control.bucket}</Badge>

                    {/* Activation Reason Badges */}
                    {control.qcb_required && selectedRegulators.includes('QCB') && (
                      <Badge variant="default" className="bg-blue-600">
                        ✓ Required by QCB
                      </Badge>
                    )}
                    {control.qfcra_required && selectedRegulators.includes('QFCRA') && (
                      <Badge variant="default" className="bg-purple-600">
                        ✓ Required by QFCRA
                      </Badge>
                    )}
                    {control.qcb_required && control.qfcra_required && (
                      <Badge variant="default" className="bg-green-600">
                        Universal (Both Regulators)
                      </Badge>
                    )}
                  </div>

                  <CardDescription className="text-sm">
                    {control.description}
                  </CardDescription>

                  {/* Test History */}
                  {control.last_test_date && (
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Last tested: {control.last_test_date}
                      </div>
                      {control.next_test_due && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Next test due: {control.next_test_due}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Execute Test Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExecuteTest(control.id)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Execute Test
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {/* Test Procedure */}
                <AccordionItem value="procedure">
                  <AccordionTrigger className="text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Test procedure</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2 text-sm">
                      <p className="text-muted-foreground mb-2">Execution steps:</p>
                      <p>{control.test_procedure}</p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Evidence types:</p>
                          <div className="space-y-1">
                            {control.evidence_types.map((evidence, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs mr-1">{evidence}</Badge>
                            ))}
                          </div>
                        </div>
                        {control.kri_tracked.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">KRIs tracked:</p>
                            <div className="space-y-1">
                              {control.kri_tracked.map((kri, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs mr-1">{kri.replace(/_/g, ' ')}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Related Obligations */}
                <AccordionItem value="obligations">
                  <AccordionTrigger className="text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>Satisfies <strong>{control.related_obligations.length}</strong> obligations</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {control.related_obligations.map(oblId => (
                        <div key={oblId} className="flex items-center justify-between p-2 bg-muted rounded">
                          <Badge variant="outline" className="text-xs">{oblId}</Badge>
                          <Button variant="link" size="sm" asChild>
                            <Link href={`/obligations?highlight=${oblId}`}>
                              View obligation <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                      {control.related_obligations.length === 0 && (
                        <p className="text-sm text-muted-foreground">Qatar-specific control without direct obligation mapping</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Source Documentation */}
                {control.source_document && (
                  <AccordionItem value="source">
                    <AccordionTrigger className="text-sm hover:no-underline">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Research source</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 text-sm">
                        <p className="text-muted-foreground mb-1">Source document:</p>
                        <p>{control.source_document}</p>
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <Link href="/research">
                            View research documentation
                          </Link>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
