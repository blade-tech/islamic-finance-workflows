'use client'

/**
 * RESEARCH METHODOLOGY PAGE
 * =========================
 * Shows the 8-phase systematic approach used to build the Qatar GRC framework.
 * Complete transparency into the research process.
 */

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  FileSearch,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Filter,
  FileText,
  Shield,
  Code2,
  Layers,
  TrendingUp
} from 'lucide-react'

export default function MethodologyPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Research Methodology</h1>
        <p className="text-muted-foreground mt-2">
          8-phase systematic approach used to build the Qatar GRC framework
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

      {/* Overview */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <FileSearch className="w-6 h-6" />
            Methodology Overview
          </CardTitle>
          <CardDescription className="text-blue-700">
            Systematic, transparent approach ensuring accuracy and completeness
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Systematic:</strong> 8 structured phases from document collection to activation logic
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Transparent:</strong> Every decision documented with source references
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Validated:</strong> Peer review and cross-checking against source documents
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Reproducible:</strong> Methodology can be applied to other jurisdictions (UAE, Saudi Arabia)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>8-Phase Research Process</CardTitle>
          <CardDescription>
            Click each phase to see detailed methodology and outputs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {/* Phase 1: Document Collection */}
            <AccordionItem value="phase-1">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-blue-600 text-white">Phase 1</Badge>
                  <FileText className="w-5 h-5" />
                  <span className="font-semibold">Document Collection</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <div className="font-semibold mb-2">What We Did:</div>
                    <div className="text-sm text-muted-foreground">
                      Collected all relevant regulatory documents for Qatar Islamic finance institutions
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Method:</div>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Reviewed QCB official website and legal database</li>
                      <li>Reviewed QFCRA regulatory handbook and rulebooks</li>
                      <li>Obtained AAOIFI Governance Standards (GS1-GS7)</li>
                      <li>Cross-referenced with industry publications</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Output:</div>
                    <div className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>📄 QCB Law 13/2012 (Islamic Banking Chapter)</div>
                        <div>📄 QFCRA ISFI Rulebook</div>
                        <div>📄 AAOIFI GS1 (SSB Appointment)</div>
                        <div>📄 AAOIFI GS3 (Internal Controls)</div>
                        <div>📄 AAOIFI GS6 (Internal Audit)</div>
                        <div>📄 Industry best practices (12 documents)</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Quality Check:</div>
                    <div className="text-sm text-green-600">
                      ✓ All documents verified as current and official
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phase 2: Obligation Extraction */}
            <AccordionItem value="phase-2">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-blue-600 text-white">Phase 2</Badge>
                  <Filter className="w-5 h-5" />
                  <span className="font-semibold">Obligation Extraction</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <div className="font-semibold mb-2">What We Did:</div>
                    <div className="text-sm text-muted-foreground">
                      Extracted individual regulatory obligations from each document
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Method:</div>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Section-by-section analysis of each document</li>
                      <li>Identified mandatory requirements ("must", "shall", "required")</li>
                      <li>Extracted obligation statement and source reference</li>
                      <li>Tagged with regulator, document, and section number</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Output:</div>
                    <div className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-semibold text-blue-600">QCB</div>
                          <div className="text-2xl font-bold">46</div>
                          <div className="text-xs text-muted-foreground">Obligations extracted</div>
                        </div>
                        <div>
                          <div className="font-semibold text-purple-600">QFCRA</div>
                          <div className="text-2xl font-bold">28</div>
                          <div className="text-xs text-muted-foreground">Obligations extracted</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Example Obligation:</div>
                    <div className="bg-white p-3 rounded border text-sm">
                      <div className="font-medium mb-1">"Establish SSB with minimum 3 qualified scholars"</div>
                      <div className="text-xs text-muted-foreground">Source: QCB Law 13/2012, Article 109</div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phase 3: Categorization */}
            <AccordionItem value="phase-3">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-blue-600 text-white">Phase 3</Badge>
                  <Layers className="w-5 h-5" />
                  <span className="font-semibold">Obligation Categorization</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <div className="font-semibold mb-2">What We Did:</div>
                    <div className="text-sm text-muted-foreground">
                      Categorized obligations by subject area for organization
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Categories Defined:</div>
                    <div className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>• SSB_GOVERNANCE</div>
                        <div>• SNCR_MANAGEMENT</div>
                        <div>• PRODUCT_APPROVAL</div>
                        <div>• RISK_MANAGEMENT</div>
                        <div>• REPORTING</div>
                        <div>• INTERNAL_CONTROLS</div>
                        <div>• AML_CFT</div>
                        <div>• AUDIT</div>
                        <div>• DISCLOSURE</div>
                        <div>• CAPITAL_ADEQUACY</div>
                        <div>• TRANSACTION_APPROVAL</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Output:</div>
                    <div className="text-sm text-green-600">
                      ✓ All 74 obligations (46+28) categorized into 11 categories
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phase 4: Duplicate Detection */}
            <AccordionItem value="phase-4">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-amber-600 text-white">Phase 4</Badge>
                  <GitBranch className="w-5 h-5" />
                  <span className="font-semibold">Duplicate Detection</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <div className="font-semibold mb-2">What We Did:</div>
                    <div className="text-sm text-muted-foreground">
                      Identified overlapping requirements between QCB and QFCRA
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Method:</div>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Semantic similarity analysis (comparing obligation text)</li>
                      <li>Manual review of similar obligations</li>
                      <li>Category-based grouping for comparison</li>
                      <li>Expert validation of identified duplicates</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Output:</div>
                    <div className="bg-white p-3 rounded border">
                      <div className="text-2xl font-bold text-amber-600">14</div>
                      <div className="text-sm">Duplicate obligations identified</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Example: Both QCB and QFCRA require "Minimum 3 SSB members"
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phase 5: Conflict Resolution */}
            <AccordionItem value="phase-5">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-red-600 text-white">Phase 5</Badge>
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">Conflict Resolution</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <div className="font-semibold mb-2">What We Did:</div>
                    <div className="text-sm text-muted-foreground">
                      Resolved conflicts when QCB and QFCRA have different requirements
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Resolution Principle:</div>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded text-sm">
                      <strong>"Strictest Requirement Wins"</strong> - When requirements differ, apply the more stringent rule
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Example Conflicts Resolved:</div>
                    <div className="bg-white p-3 rounded border space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span>SSB position limits</span>
                        <Badge variant="outline">QCB: Max 3 ✓ (stricter)</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Meeting frequency</span>
                        <Badge variant="outline">QCB: Quarterly ✓ (more frequent)</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>SNCR reporting</span>
                        <Badge variant="outline">Both aligned ✓</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Output:</div>
                    <div className="text-sm text-green-600">
                      ✓ Conflict resolution matrix with 14 conflicts resolved and documented
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phase 6: Unification */}
            <AccordionItem value="phase-6">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-green-600 text-white">Phase 6</Badge>
                  <GitBranch className="w-5 h-5" />
                  <span className="font-semibold">Obligation Unification</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <div className="font-semibold mb-2">What We Did:</div>
                    <div className="text-sm text-muted-foreground">
                      Merged 46 QCB + 28 QFCRA obligations into 60 unified obligations
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Unification Formula:</div>
                    <div className="bg-white p-3 rounded border font-mono text-sm">
                      <div>46 (QCB) + 28 (QFCRA) - 14 (duplicates) = <strong className="text-green-600">60 unified</strong></div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Applicability Tracking:</div>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Each obligation tagged with applicable regulator(s): ['QCB'], ['QFCRA'], or ['QCB', 'QFCRA']</li>
                      <li>Conflicts resolved using strictest requirement principle</li>
                      <li>Source references preserved for both regulators when merged</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Output:</div>
                    <div className="text-sm text-green-600">
                      ✓ 60 unified obligations with dual-applicability tracking
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phase 7: Control Mapping */}
            <AccordionItem value="phase-7">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-purple-600 text-white">Phase 7</Badge>
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Control Mapping</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <div className="font-semibold mb-2">What We Did:</div>
                    <div className="text-sm text-muted-foreground">
                      Mapped regulatory obligations to operational controls
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Method:</div>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Designed control library using AAOIFI best practices</li>
                      <li>Mapped each control to related obligations</li>
                      <li>Tagged controls with regulator requirements (qcb_required, qfcra_required)</li>
                      <li>Defined test procedures and evidence types</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Control Categories (Buckets):</div>
                    <div className="bg-white p-3 rounded border grid grid-cols-3 gap-2 text-sm">
                      <div>• shariah</div>
                      <div>• risk</div>
                      <div>• compliance</div>
                      <div>• finance</div>
                      <div>• operations</div>
                      <div>• audit</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Output:</div>
                    <div className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-2xl font-bold">34</div>
                          <div className="text-xs text-muted-foreground">Total controls</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">26</div>
                          <div className="text-xs text-muted-foreground">Universal controls</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">8</div>
                          <div className="text-xs text-muted-foreground">Qatar-specific</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phase 8: Activation Logic */}
            <AccordionItem value="phase-8">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-indigo-600 text-white">Phase 8</Badge>
                  <Code2 className="w-5 h-5" />
                  <span className="font-semibold">Activation Logic Design</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <div className="font-semibold mb-2">What We Did:</div>
                    <div className="text-sm text-muted-foreground">
                      Created transparent, rule-based activation logic in TypeScript
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Activation Rules:</div>
                    <div className="bg-white p-3 rounded border font-mono text-sm">
                      <div className="space-y-1">
                        <div className="text-blue-600">// Control Activation</div>
                        <div>if (selectedRegulators.includes('QCB') && control.qcb_required)</div>
                        <div className="ml-4">→ activate(control)</div>
                        <div>if (selectedRegulators.includes('QFCRA') && control.qfcra_required)</div>
                        <div className="ml-4">→ activate(control)</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Implementation:</div>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Zustand store for state management (frontend-only)</li>
                      <li>Boolean flags on controls (qcb_required, qfcra_required)</li>
                      <li>Real-time filtering based on regulator selection</li>
                      <li>Complete transparency - activation code shown in UI</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Output:</div>
                    <div className="text-sm text-green-600">
                      ✓ Transparent activation logic implemented in grc-store.ts
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Quality Assurance */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            Quality Assurance & Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white p-4 rounded-lg border space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Peer Review:</strong> All extracted obligations reviewed by second analyst
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Source Validation:</strong> Every obligation cross-checked against original documents
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Activation Testing:</strong> Logic tested with all regulator combinations
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Industry Validation:</strong> Framework reviewed against industry best practices
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reproducibility */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Methodology Reproducibility</CardTitle>
          <CardDescription className="text-blue-700">
            This methodology can be applied to other jurisdictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-lg border text-sm">
            The 8-phase methodology is jurisdiction-agnostic and can be applied to:
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Planned</Badge>
                <span>UAE (CBUAE + DFSA + ADGM + DIFC)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Planned</Badge>
                <span>Saudi Arabia (SAMA + CMA)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Planned</Badge>
                <span>Other GCC countries (Bahrain, Kuwait, Oman)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
