'use client'

/**
 * METHODOLOGY UPLOAD FLOW
 * =======================
 * Mock flow for uploading and digitizing methodology documents.
 *
 * Shows 7-step Guardian digitization process with service badges.
 * Uses existing MCP Proxy and Documents Service.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  FileCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Server,
  Info,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { ServiceDependencyBadge } from './ServiceDependencyBadge'
import { mockParsedDocument } from '@/lib/mock-data/mock-parsed-document'
import { mockAnalysis } from '@/lib/mock-data/mock-analysis'
import { mockSchemas } from '@/lib/mock-data/mock-schemas'
import { mockPolicy } from '@/lib/mock-data/mock-policy'
import { mockCalculations } from '@/lib/mock-data/mock-calculations'
import { mockValidationResults } from '@/lib/mock-data/mock-validation-results'
import type { ProcessState } from '@/lib/types/digitization'

type StepStatus = 'pending' | 'processing' | 'complete' | 'error'

interface DigitizationStep {
  id: number
  name: string
  service?: 'documents' | 'mcp' | null
  estimatedDuration: string
  status: StepStatus
  description?: string
  expandedPreview?: React.ReactNode
}

export function MethodologyUploadFlow() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [currentState, setCurrentState] = useState<ProcessState>('idle')
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  // Initialize steps
  const [steps, setSteps] = useState<DigitizationStep[]>([
    { id: 1, name: 'Upload Document', service: null, estimatedDuration: '30 sec', status: 'pending' },
    {
      id: 2,
      name: 'Parse PDF',
      service: 'documents',
      estimatedDuration: '1-2 min',
      status: 'pending',
      description: 'LlamaParse extracts structure, tables, clauses',
    },
    {
      id: 3,
      name: 'Analyze Document',
      service: 'mcp',
      estimatedDuration: '2-3 min',
      status: 'pending',
      description: 'Claude extracts Shariah requirements, stakeholder roles',
    },
    {
      id: 4,
      name: 'Generate Schemas',
      service: 'mcp',
      estimatedDuration: '3-5 min',
      status: 'pending',
      description: 'Claude generates Guardian schemas',
    },
    {
      id: 5,
      name: 'Generate Policies',
      service: 'mcp',
      estimatedDuration: '3-5 min',
      status: 'pending',
      description: 'Claude generates workflow blocks',
    },
    {
      id: 6,
      name: 'Generate Calculations',
      service: 'mcp',
      estimatedDuration: '2-3 min',
      status: 'pending',
      description: 'Claude generates JavaScript formulas',
    },
    {
      id: 7,
      name: 'Validate & Test',
      service: null,
      estimatedDuration: '10-15 min',
      status: 'pending',
      description: 'Guardian dry-run and automated testing',
    },
  ])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file)
      startDigitization(file)
    }
  }

  const startDigitization = async (file: File) => {
    // Simulate the 7-step process
    updateStep(1, 'complete')
    setCurrentState('uploading')

    await sleep(500)
    updateStep(2, 'processing')
    setCurrentState('parsing')
    await sleep(2000)
    updateStep(2, 'complete')

    updateStep(3, 'processing')
    setCurrentState('analyzing')
    await sleep(2000)
    updateStep(3, 'complete')

    updateStep(4, 'processing')
    setCurrentState('generating-schemas')
    await sleep(2000)
    updateStep(4, 'complete')

    updateStep(5, 'processing')
    setCurrentState('generating-policies')
    await sleep(2000)
    updateStep(5, 'complete')

    updateStep(6, 'processing')
    setCurrentState('generating-calcs')
    await sleep(2000)
    updateStep(6, 'complete')

    updateStep(7, 'processing')
    setCurrentState('validating')
    await sleep(3000)
    updateStep(7, 'complete')

    setCurrentState('complete')
  }

  const updateStep = (stepId: number, status: StepStatus) => {
    setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, status } : s)))
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getServiceBadge = (service?: 'documents' | 'mcp' | null) => {
    if (!service) return null
    return (
      <Badge variant="outline" className="text-xs">
        <Server className="h-3 w-3 mr-1" />
        {service === 'documents' ? 'Documents' : 'MCP Proxy'}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Service Dependencies */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" />
            <CardTitle className="text-base">Required Services</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ServiceDependencyBadge services={['mcp', 'documents']} inline />
          <p className="text-xs text-muted-foreground mt-2">
            MCP Proxy provides Claude analysis via Copilots. Documents Service provides LlamaParse PDF
            parsing.
          </p>
        </CardContent>
      </Card>

      {/* Upload Area */}
      {!uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Methodology Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">Upload a methodology PDF (IIFM, AAOIFI, etc.)</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload">
                <Button asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Select PDF File
                  </span>
                </Button>
              </label>
            </div>
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Supported: PDF (max 50MB). The document will be automatically digitized using Guardian framework
                (20-30 hours manual → ~30 min AI-powered).
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Digitization Process */}
      {uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Guardian Digitization Process</CardTitle>
            <p className="text-sm text-muted-foreground">
              📄 {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`border rounded-lg p-4 ${
                  step.status === 'complete'
                    ? 'border-green-200 bg-green-50/50'
                    : step.status === 'processing'
                    ? 'border-blue-200 bg-blue-50/50'
                    : 'border-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">
                        {step.id}. {step.name}
                      </p>
                      {getServiceBadge(step.service)}
                      <span className="text-xs text-muted-foreground ml-auto">{step.estimatedDuration}</span>
                    </div>
                    {step.description && <p className="text-xs text-muted-foreground mt-1">{step.description}</p>}
                    {step.status === 'processing' && (
                      <Progress value={66} className="h-1 mt-2" />
                    )}
                  </div>
                  {step.status === 'complete' && step.id > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                    >
                      {expandedStep === step.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>

                {/* Expanded Preview */}
                {expandedStep === step.id && step.status === 'complete' && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="text-xs font-mono">
                      {step.id === 2 && `Parsed ${mockParsedDocument.metadata.pages} pages, ${mockParsedDocument.structure.sections.length} sections, ${mockParsedDocument.structure.tables.length} tables`}
                      {step.id === 3 && `Extracted ${mockAnalysis.extractedEntities.stakeholderRoles.length} roles, ${mockAnalysis.extractedEntities.complianceRequirements.length} compliance rules, ${mockAnalysis.extractedEntities.formulas.length} formulas (${(mockAnalysis.confidence * 100).toFixed(0)}% confidence)`}
                      {step.id === 4 && `Generated ${mockSchemas.length} Guardian schemas with ${mockSchemas.reduce((acc, s) => acc + s.fields.length, 0)} total fields`}
                      {step.id === 5 && `Generated policy workflow with ${mockPolicy.workflow_blocks.length} blocks across ${mockPolicy.roles.length} roles`}
                      {step.id === 6 && `Generated ${mockCalculations.length} calculation formula(s)`}
                      {step.id === 7 && `${mockValidationResults.tests_passed}/${mockValidationResults.tests_run} tests passed, ${mockValidationResults.warnings.length} warning(s)`}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Complete State */}
      {currentState === 'complete' && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle>Digitization Complete!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-md">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium">IIFM Mudarabah Standard (ST-14)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-medium">Islamic Finance</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-medium capitalize">{mockAnalysis.category}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Standard</p>
                <p className="text-sm font-medium">{mockAnalysis.standard}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Generated Artifacts</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white rounded-md text-sm">
                  <FileCheck className="h-4 w-4 inline mr-2 text-muted-foreground" />
                  <span className="font-medium">{mockSchemas.length}</span> schemas
                </div>
                <div className="p-2 bg-white rounded-md text-sm">
                  <FileCheck className="h-4 w-4 inline mr-2 text-muted-foreground" />
                  <span className="font-medium">{mockPolicy.workflow_blocks.length}</span> policy steps
                </div>
                <div className="p-2 bg-white rounded-md text-sm">
                  <FileCheck className="h-4 w-4 inline mr-2 text-muted-foreground" />
                  <span className="font-medium">{mockCalculations.length}</span> calculation(s)
                </div>
                <div className="p-2 bg-white rounded-md text-sm">
                  <FileCheck className="h-4 w-4 inline mr-2 text-muted-foreground" />
                  <span className="font-medium">{mockPolicy.roles.length}</span> required roles
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve & Save
              </Button>
              <Button variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Download Guardian Package
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
