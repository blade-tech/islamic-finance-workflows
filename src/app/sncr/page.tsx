'use client'

/**
 * SNCR TRACKING PAGE
 * ==================
 * Shariah Non-Compliance Risk incident tracking and purification management.
 */

import { useState } from 'react'
import { useGRCStore } from '@/lib/grc-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { AlertTriangle, CheckCircle2, Clock, DollarSign, Calendar, FileText } from 'lucide-react'
import type { SNCRSeverity, SNCRStatus } from '@/lib/grc-types'

export default function SNCRPage() {
  const { sncrIncidents, purificationJournal } = useGRCStore()
  const [activeTab, setActiveTab] = useState<'incidents' | 'purification'>('incidents')

  const openIncidents = sncrIncidents.filter(i => i.status !== 'RESOLVED')
  const totalPurificationPending = sncrIncidents
    .filter(i => i.purification_status === 'PENDING')
    .reduce((sum, i) => sum + (i.purification_amount || 0), 0)

  const getSeverityIcon = (severity: SNCRSeverity) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'MEDIUM':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusBadge = (status: SNCRStatus) => {
    switch (status) {
      case 'RESOLVED':
        return <Badge variant="default" className="bg-green-600">RESOLVED</Badge>
      case 'UNDER_REVIEW':
        return <Badge variant="secondary">UNDER REVIEW</Badge>
      case 'ESCALATED':
        return <Badge variant="destructive">ESCALATED</Badge>
      default:
        return <Badge variant="outline">REPORTED</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SNCR Incident Tracking</h1>
        <p className="text-muted-foreground mt-2">
          Shariah Non-Compliance Risk management and purification (Taharah) tracking
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

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{sncrIncidents.length}</div>
            <div className="text-xs text-muted-foreground">Total Incidents</div>
          </CardContent>
        </Card>
        <Card className={openIncidents.length > 0 ? 'bg-red-50 border-red-200' : ''}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{openIncidents.length}</div>
            <div className="text-xs text-muted-foreground">Open Incidents</div>
          </CardContent>
        </Card>
        <Card className={totalPurificationPending > 0 ? 'bg-amber-50 border-amber-200' : ''}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {totalPurificationPending.toFixed(2)} QAR
            </div>
            <div className="text-xs text-muted-foreground">Purification Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'incidents'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('incidents')}
        >
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          Incidents ({sncrIncidents.length})
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'purification'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('purification')}
        >
          <DollarSign className="w-4 h-4 inline mr-2" />
          Purification Journal ({purificationJournal.length})
        </button>
      </div>

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          {sncrIncidents.map(incident => (
            <Card key={incident.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getSeverityIcon(incident.severity)}
                      <CardTitle className="text-lg">{incident.description}</CardTitle>
                      <Badge variant={incident.severity === 'CRITICAL' || incident.severity === 'HIGH' ? 'destructive' : 'secondary'}>
                        {incident.severity}
                      </Badge>
                      {getStatusBadge(incident.status)}
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Incident Date: {incident.incident_date}
                      </span>
                      <span>Detected by: {incident.detected_by}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {incident.purification_amount && (
                  <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold">Purification Amount: {incident.purification_amount.toFixed(2)} {incident.ssb_ruling ? 'QAR' : ''}</span>
                    </div>
                    <Badge variant={incident.purification_status === 'DISTRIBUTED' ? 'default' : 'secondary'}>
                      {incident.purification_status}
                    </Badge>
                  </div>
                )}

                {incident.ssb_ruling && (
                  <div>
                    <div className="text-sm font-semibold mb-1">SSB Ruling:</div>
                    <div className="text-sm bg-blue-50 border border-blue-200 p-3 rounded">
                      {incident.ssb_ruling}
                    </div>
                  </div>
                )}

                {incident.remediation_plan && (
                  <div>
                    <div className="text-sm font-semibold mb-1">Remediation Plan:</div>
                    <div className="text-sm bg-muted p-3 rounded">
                      {incident.remediation_plan}
                      {incident.remediation_completed && (
                        <div className="mt-2 flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Completed on {incident.remediation_date}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {incident.reported_to_regulator && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="destructive">Reported to Regulator</Badge>
                    {incident.regulator_reference && (
                      <span className="text-muted-foreground">Ref: {incident.regulator_reference}</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Purification Journal Tab */}
      {activeTab === 'purification' && (
        <div className="space-y-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="text-sm text-green-800">
                <strong>Purification (Taharah):</strong> Islamic requirement to donate non-Shariah compliant income to charity.
                All purified amounts are distributed to approved charitable organizations.
              </div>
            </CardContent>
          </Card>

          {purificationJournal.map(entry => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {entry.amount.toFixed(2)} {entry.currency}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Incident: {entry.incident_id}
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Distributed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-muted-foreground">Recipient</div>
                    <div className="font-medium">{entry.recipient}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Purification Date</div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {entry.purification_date}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Receipt Reference</div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {entry.receipt_reference}
                  </div>
                </div>
                {entry.notes && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-muted-foreground">Notes</div>
                    <div>{entry.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
