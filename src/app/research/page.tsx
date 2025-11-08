'use client'

/**
 * RESEARCH DOCUMENTATION HUB
 * ==========================
 * Central hub for all Qatar GRC research documentation.
 * Shows what data was collected, where it came from, and research outputs.
 */

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FileText,
  BookOpen,
  ExternalLink,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  GitBranch,
  FileSearch,
  Shield,
  Users,
  AlertTriangle
} from 'lucide-react'

export default function ResearchPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Qatar GRC Research Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Complete transparency into research sources, methodology, and outputs
        </p>
      </div>

      {/* Research Overview */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <CardTitle className="text-blue-900">Research Overview</CardTitle>
              <CardDescription className="text-blue-700 mt-2">
                Comprehensive research into Qatar's dual regulatory framework for Islamic finance institutions
              </CardDescription>
              <div className="mt-4 space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <strong>Scope:</strong> Qatar (QCB + QFCRA dual-regulator framework)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <strong>Focus:</strong> Islamic finance-specific obligations and controls
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <strong>Approach:</strong> Systematic 8-phase methodology with conflict resolution
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Research Outputs Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">60</div>
            <div className="text-xs text-muted-foreground mt-1">Unified Obligations</div>
            <div className="text-xs text-green-600 mt-2">✓ Complete</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">34</div>
            <div className="text-xs text-muted-foreground mt-1">Mapped Controls</div>
            <div className="text-xs text-green-600 mt-2">✓ Complete</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">2</div>
            <div className="text-xs text-muted-foreground mt-1">Regulators Unified</div>
            <div className="text-xs text-blue-600 mt-2">QCB + QFCRA</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">14</div>
            <div className="text-xs text-muted-foreground mt-1">Conflicts Resolved</div>
            <div className="text-xs text-green-600 mt-2">✓ Documented</div>
          </CardContent>
        </Card>
      </div>

      {/* Source Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Source Documents
          </CardTitle>
          <CardDescription>
            Primary regulatory documents analyzed to extract obligations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* QCB Law 13/2012 */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-blue-600 text-white">QCB</Badge>
                    <span className="font-semibold">Qatar Central Bank Law No. 13 of 2012</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>📍 <strong>Sections Analyzed:</strong> Articles 109-115 (Islamic Banking Chapter)</div>
                    <div>📊 <strong>Obligations Extracted:</strong> 46 requirements</div>
                    <div>🎯 <strong>Focus Areas:</strong> SSB governance, SNCR management, product approval</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Source
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QFCRA ISFI Rulebook */}
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-purple-600 text-white">QFCRA</Badge>
                    <span className="font-semibold">ISFI Rulebook (Islamic Finance Rules)</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>📍 <strong>Sections Analyzed:</strong> Chapters 2-7 (Governance & Risk)</div>
                    <div>📊 <strong>Obligations Extracted:</strong> 28 requirements</div>
                    <div>🎯 <strong>Focus Areas:</strong> SSB composition, reporting, internal controls</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Source
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AAOIFI Standards */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-green-600 text-white">AAOIFI</Badge>
                    <span className="font-semibold">AAOIFI Governance Standards (GS1-GS7)</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>📍 <strong>Standards Used:</strong> GS1 (SSB), GS3 (Internal Controls), GS6 (Audit)</div>
                    <div>📊 <strong>Purpose:</strong> Industry best practices for control mapping</div>
                    <div>🎯 <strong>Focus Areas:</strong> SSB qualifications, control procedures, audit requirements</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Standards
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Unification Process Summary */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <GitBranch className="w-5 h-5" />
            Unification Process: 46 + 28 → 60 Obligations
          </CardTitle>
          <CardDescription className="text-amber-700">
            How we merged QCB and QFCRA requirements into a unified framework
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">46</div>
              <div className="text-xs text-muted-foreground">QCB Obligations</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">28</div>
              <div className="text-xs text-muted-foreground">QFCRA Obligations</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">60</div>
              <div className="text-xs text-muted-foreground">Unified (14 duplicates merged)</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg text-sm space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Duplicate Detection:</strong> 14 overlapping requirements identified (e.g., both require minimum 3 SSB members)
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Conflict Resolution:</strong> When QCB and QFCRA differ, strictest requirement applied (e.g., QCB limits scholars to 3 positions, QFCRA has no limit → Use QCB rule)
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Applicability Tracking:</strong> Every obligation tagged with which regulator(s) require it
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation to Detailed Pages */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <Link href="/research/mapping" className="block">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Obligation-Control Mapping</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Visual diagram showing how obligations map to controls and activation logic
                  </p>
                  <Button variant="link" className="p-0 h-auto">
                    View Mapping <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <Link href="/research/methodology" className="block">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FileSearch className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Research Methodology</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    8-phase systematic approach used to build the Qatar GRC framework
                  </p>
                  <Button variant="link" className="p-0 h-auto">
                    View Methodology <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <Link href="/obligations">
              <Shield className="w-4 h-4 mr-2" />
              Obligations Register
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/controls">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Control Library
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/ssb">
              <Users className="w-4 h-4 mr-2" />
              SSB Governance
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/sncr">
              <AlertTriangle className="w-4 h-4 mr-2" />
              SNCR Tracking
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
