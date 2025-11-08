'use client'

/**
 * SSB GOVERNANCE PAGE
 * ===================
 * Shariah Supervisory Board management and decision tracking.
 */

import { useState } from 'react'
import { useGRCStore } from '@/lib/grc-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Users, FileText, CheckCircle2, Calendar, Award } from 'lucide-react'

export default function SSBPage() {
  const { ssbMembers, ssbDecisions } = useGRCStore()
  const [activeTab, setActiveTab] = useState<'members' | 'decisions'>('members')

  const activeMembers = ssbMembers.filter(m => m.status === 'ACTIVE')

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SSB Governance</h1>
        <p className="text-muted-foreground mt-2">
          Shariah Supervisory Board member management and decision tracking
        </p>
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

      {/* Compliance Check */}
      <Card className={activeMembers.length >= 3 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {activeMembers.length >= 3 ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Users className="w-6 h-6 text-red-600" />
            )}
            <div>
              <div className="font-semibold">
                {activeMembers.length >= 3 ? '✓ Compliant' : '⚠ Non-Compliant'}
              </div>
              <div className="text-sm text-muted-foreground">
                {activeMembers.length} active SSB members (minimum 3 required by QCB/QFCRA)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'members'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('members')}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Members ({ssbMembers.length})
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'decisions'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('decisions')}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Decisions ({ssbDecisions.length})
        </button>
      </div>

      {/* SSB Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          {ssbMembers.map(member => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <Badge variant={member.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                      {member.current_positions_count <= 3 && (
                        <Badge variant="outline" className="text-xs">
                          {member.current_positions_count}/3 positions
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{member.qualifications}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Appointment Date</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />
                      {member.appointment_date}
                    </div>
                  </div>
                  {member.term_expiry && (
                    <div>
                      <div className="text-muted-foreground">Term Expiry</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-4 h-4" />
                        {member.term_expiry}
                      </div>
                    </div>
                  )}
                </div>
                {member.specializations && (
                  <div className="mt-3">
                    <div className="text-sm text-muted-foreground mb-2">Specializations:</div>
                    <div className="flex gap-2 flex-wrap">
                      {member.specializations.map(spec => (
                        <Badge key={spec} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* SSB Decisions Tab */}
      {activeTab === 'decisions' && (
        <div className="space-y-4">
          {ssbDecisions.map(decision => (
            <Card key={decision.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{decision.description}</CardTitle>
                      <Badge>{decision.decision_type.replace(/_/g, ' ')}</Badge>
                      {decision.unanimous && (
                        <Badge variant="default" className="bg-green-600">
                          ✓ Unanimous
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Decision Date: {decision.decision_date}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-semibold mb-1">Ruling:</div>
                  <div className="text-sm bg-muted p-3 rounded">{decision.ruling}</div>
                </div>
                {decision.dissenting_opinions && (
                  <div>
                    <div className="text-sm font-semibold mb-1">Dissenting Opinion:</div>
                    <div className="text-sm bg-amber-50 border border-amber-200 p-3 rounded">
                      {decision.dissenting_opinions}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="w-4 h-4" />
                  Effective Date: {decision.effective_date}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
