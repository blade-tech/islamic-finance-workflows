'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIjarahStore } from '@/lib/qatar-ijarah/ijarah-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  DollarSign,
  Building2,
  ArrowRight,
  Shield,
  AlertTriangle,
  FileCheck,
  Banknote
} from 'lucide-react'

export default function EscrowWiringPage() {
  const router = useRouter()
  const { currentProject, escrowAccount, loadDemoData } = useIjarahStore()
  const [buyerPayments, setBuyerPayments] = useState([
    { id: 'bp-001', buyerId: 'buyer-001', buyerName: 'Ahmed Al-Thani', unitId: 'unit-12', amount: 500000, currency: 'QAR', date: '2025-01-15', verified: true, allocated: true },
    { id: 'bp-002', buyerId: 'buyer-002', buyerName: 'Fatima Al-Kuwari', unitId: 'unit-08', amount: 750000, currency: 'QAR', date: '2025-01-16', verified: true, allocated: true },
    { id: 'bp-003', buyerId: 'buyer-003', buyerName: 'Mohammed Al-Sulaiti', unitId: 'unit-15', amount: 600000, currency: 'QAR', date: '2025-01-18', verified: false, allocated: false },
  ])

  useEffect(() => {
    if (!currentProject) {
      loadDemoData()
    }
  }, [currentProject, loadDemoData])

  const handleVerifyPayment = (paymentId: string) => {
    setBuyerPayments(prev =>
      prev.map(p => p.id === paymentId ? { ...p, verified: true, allocated: true } : p)
    )
  }

  if (!currentProject || !escrowAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading escrow data...</p>
        </div>
      </div>
    )
  }

  const verifiedPayments = buyerPayments.filter(p => p.verified).length
  const totalPayments = buyerPayments.length
  const verificationProgress = (verifiedPayments / totalPayments) * 100

  const totalReceived = buyerPayments.reduce((sum, p) => sum + (p.verified ? p.amount : 0), 0)
  const totalAllocated = buyerPayments.reduce((sum, p) => sum + (p.allocated ? p.amount : 0), 0)
  const unallocatedFunds = totalReceived - totalAllocated

  const escrowCompliant = escrowAccount.qcbCompliant && verifiedPayments === totalPayments

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/qatar-ijarah')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Scene 2: Escrow Wiring</h1>
                <p className="text-sm text-gray-600">QCB Circular 2/2025 Compliance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={escrowCompliant ? "default" : "secondary"} className="text-sm px-3 py-1">
                {escrowCompliant ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    QCB Compliant
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Pending Verification
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Escrow Account Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center text-lg">
                  <Lock className="h-5 w-5 mr-2 text-blue-600" />
                  Escrow Account
                </CardTitle>
                <CardDescription>QCB Circular 2/2025 Art.2</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Number</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">
                    {escrowAccount.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bank Name</p>
                  <p className="text-gray-900">{escrowAccount.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Type</p>
                  <Badge variant="outline" className="capitalize">
                    {escrowAccount.accountType}
                  </Badge>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">QCB Compliance Status</p>
                  <div className="flex items-center space-x-2">
                    {escrowAccount.qcbCompliant ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">Compliant</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-semibold text-orange-700">Pending Setup</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {escrowAccount.currency} {escrowAccount.balance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Received</p>
                  <p className="text-lg font-semibold text-gray-900">
                    QAR {totalReceived.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Allocated</p>
                  <p className="text-lg font-semibold text-gray-900">
                    QAR {totalAllocated.toLocaleString()}
                  </p>
                </div>
                {unallocatedFunds > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Unallocated Funds</p>
                    <p className="text-lg font-semibold text-orange-600">
                      QAR {unallocatedFunds.toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm text-blue-900">Control Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-blue-800 font-mono mb-2">IJR-B6: Escrow Compliance</p>
                <p className="text-sm text-blue-900 mb-3">
                  QCB Circular 2/2025 Art.2 requires all off-plan buyer funds in escrow accounts.
                </p>
                <div className="space-y-2 text-xs text-blue-800">
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Separate escrow account</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Authority-approved bank</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Verified buyer payments</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Milestone-based disbursement</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Payment Processing */}
          <div className="lg:col-span-2 space-y-6">
            {/* Verification Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
                    Payment Verification Progress
                  </span>
                  <Badge variant="outline">
                    {verifiedPayments} / {totalPayments} Verified
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex justify-between items-center">
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <p className="text-sm font-semibold text-gray-900">{Math.round(verificationProgress)}%</p>
                </div>
                <Progress value={verificationProgress} className="h-2" />
              </CardContent>
            </Card>

            {/* Buyer Payments */}
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center">
                  <Banknote className="h-6 w-6 mr-2 text-blue-600" />
                  Buyer Payments
                </CardTitle>
                <CardDescription>
                  Incoming payments from off-plan unit buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {buyerPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className={`p-4 rounded-lg border-2 ${
                        payment.verified
                          ? 'bg-green-50 border-green-200'
                          : 'bg-orange-50 border-orange-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            payment.verified ? 'bg-green-100' : 'bg-orange-100'
                          }`}>
                            {payment.verified ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-orange-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{payment.buyerName}</h4>
                            <p className="text-sm text-gray-600">Unit {payment.unitId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {payment.currency} {payment.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(payment.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">Verification:</span>
                          <Badge variant={payment.verified ? 'default' : 'secondary'} className="text-xs">
                            {payment.verified ? 'Verified' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">Allocation:</span>
                          <Badge variant={payment.allocated ? 'default' : 'secondary'} className="text-xs">
                            {payment.allocated ? 'Allocated' : 'Pending'}
                          </Badge>
                        </div>
                      </div>

                      {!payment.verified && (
                        <div className="pt-3 border-t border-orange-300">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-orange-800">
                              <AlertTriangle className="h-4 w-4 inline mr-1" />
                              Payment requires verification
                            </p>
                            <Button
                              size="sm"
                              onClick={() => handleVerifyPayment(payment.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Verify Payment
                            </Button>
                          </div>
                        </div>
                      )}

                      {payment.verified && (
                        <div className="pt-3 border-t border-green-300">
                          <p className="text-sm text-green-800 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Payment verified and allocated to unit sub-ledger
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fund Flow Diagram */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fund Flow</CardTitle>
                <CardDescription>How buyer payments flow through the escrow system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-8">
                  <div className="text-center flex-1">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Buyer Payment</p>
                    <p className="text-xs text-gray-600 mt-1">Wire transfer</p>
                  </div>

                  <ArrowRight className="h-8 w-8 text-gray-400 flex-shrink-0 mx-4" />

                  <div className="text-center flex-1">
                    <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-2">
                      <Lock className="h-8 w-8 text-cyan-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Escrow Account</p>
                    <p className="text-xs text-gray-600 mt-1">QCB-compliant</p>
                  </div>

                  <ArrowRight className="h-8 w-8 text-gray-400 flex-shrink-0 mx-4" />

                  <div className="text-center flex-1">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Verification</p>
                    <p className="text-xs text-gray-600 mt-1">Auto-reconciliation</p>
                  </div>

                  <ArrowRight className="h-8 w-8 text-gray-400 flex-shrink-0 mx-4" />

                  <div className="text-center flex-1">
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                      <Building2 className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Unit Sub-Ledger</p>
                    <p className="text-xs text-gray-600 mt-1">Allocation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            {escrowCompliant && (
              <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900">Escrow Setup Complete!</h3>
                        <p className="text-sm text-blue-700">
                          All payments verified. Ready to track construction progress.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push('/qatar-ijarah')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continue to Next Scene
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
