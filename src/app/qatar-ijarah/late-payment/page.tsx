'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIjarahStore } from '@/lib/qatar-ijarah/ijarah-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Heart,
  DollarSign,
  Calendar,
  TrendingUp,
  Ban
} from 'lucide-react'

interface LatePayment {
  id: string
  lesseeId: string
  lesseeName: string
  unitId: string
  invoiceId: string
  invoiceDate: string
  dueDate: string
  paidDate?: string
  amount: number
  currency: string
  daysLate: number
  penaltyRate: number  // Daily penalty rate (not interest!)
  penaltyAmount: number
  charityAllocated: boolean
  charityRecipient?: string
  status: 'overdue' | 'paid-late' | 'paid-on-time'
}

export default function LatePaymentPage() {
  const router = useRouter()
  const { currentProject, loadDemoData } = useIjarahStore()

  const [payments, setPayments] = useState<LatePayment[]>([
    {
      id: 'pay-001',
      lesseeId: 'lessee-001',
      lesseeName: 'Ahmed Al-Thani',
      unitId: 'unit-12',
      invoiceId: 'INV-2025-001',
      invoiceDate: '2025-01-01',
      dueDate: '2025-01-15',
      paidDate: '2025-01-14',
      amount: 50000,
      currency: 'QAR',
      daysLate: 0,
      penaltyRate: 100,
      penaltyAmount: 0,
      charityAllocated: false,
      status: 'paid-on-time'
    },
    {
      id: 'pay-002',
      lesseeId: 'lessee-002',
      lesseeName: 'Fatima Al-Kuwari',
      unitId: 'unit-08',
      invoiceId: 'INV-2025-002',
      invoiceDate: '2025-01-01',
      dueDate: '2025-01-15',
      paidDate: '2025-01-22',
      amount: 62500,
      currency: 'QAR',
      daysLate: 7,
      penaltyRate: 100,
      penaltyAmount: 700,
      charityAllocated: true,
      charityRecipient: 'Qatar Charity',
      status: 'paid-late'
    },
    {
      id: 'pay-003',
      lesseeId: 'lessee-003',
      lesseeName: 'Mohammed Al-Sulaiti',
      unitId: 'unit-15',
      invoiceId: 'INV-2025-003',
      invoiceDate: '2025-02-01',
      dueDate: '2025-02-15',
      paidDate: '2025-02-28',
      amount: 55000,
      currency: 'QAR',
      daysLate: 13,
      penaltyRate: 100,
      penaltyAmount: 1300,
      charityAllocated: true,
      charityRecipient: 'Qatar Red Crescent',
      status: 'paid-late'
    },
    {
      id: 'pay-004',
      lesseeId: 'lessee-004',
      lesseeName: 'Noora Al-Mannai',
      unitId: 'unit-22',
      invoiceId: 'INV-2025-004',
      invoiceDate: '2025-03-01',
      dueDate: '2025-03-15',
      amount: 58000,
      currency: 'QAR',
      daysLate: Math.ceil((new Date().getTime() - new Date('2025-03-15').getTime()) / (1000 * 60 * 60 * 24)),
      penaltyRate: 100,
      penaltyAmount: Math.ceil((new Date().getTime() - new Date('2025-03-15').getTime()) / (1000 * 60 * 60 * 24)) * 100,
      charityAllocated: false,
      status: 'overdue'
    }
  ])

  useEffect(() => {
    if (!currentProject) {
      loadDemoData()
    }
  }, [currentProject, loadDemoData])

  const handleAllocateCharity = (paymentId: string, charity: string) => {
    setPayments(prev =>
      prev.map(p => p.id === paymentId ? { ...p, charityAllocated: true, charityRecipient: charity, status: 'paid-late' as const, paidDate: new Date().toISOString().split('T')[0] } : p)
    )
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
        </div>
      </div>
    )
  }

  const totalPenalties = payments.reduce((sum, p) => sum + p.penaltyAmount, 0)
  const charityAllocated = payments.filter(p => p.charityAllocated).reduce((sum, p) => sum + p.penaltyAmount, 0)
  const pendingAllocation = totalPenalties - charityAllocated

  const overdueCount = payments.filter(p => p.status === 'overdue').length
  const latePaymentCount = payments.filter(p => p.status === 'paid-late').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Scene 7: Late Payment Handling</h1>
                <p className="text-sm text-gray-600">AAOIFI FAS-28 - Charity-Based Penalties (No Riba)</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {overdueCount > 0 && (
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {overdueCount} Overdue
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-red-200">
              <CardHeader className="bg-gradient-to-br from-red-50 to-pink-50">
                <CardTitle className="flex items-center text-lg">
                  <Heart className="h-5 w-5 mr-2 text-red-600" />
                  Charity Allocation
                </CardTitle>
                <CardDescription>Penalties → Charity (Not IFI Profit)</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Late Payment Penalties</p>
                  <p className="text-2xl font-bold text-gray-900">
                    QAR {totalPenalties.toLocaleString()}
                  </p>
                </div>
                <div className="pt-4 border-t space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-green-600" />
                      Allocated to Charity
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      QAR {charityAllocated.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-orange-600" />
                      Pending Allocation
                    </p>
                    <p className="text-lg font-semibold text-orange-600">
                      QAR {pendingAllocation.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Payment Status</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">On-time payments</span>
                      <Badge variant="default">
                        {payments.filter(p => p.status === 'paid-on-time').length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Late payments (resolved)</span>
                      <Badge variant="secondary">
                        {latePaymentCount}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Currently overdue</span>
                      <Badge variant="destructive">
                        {overdueCount}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Charity Recipients</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Qatar Charity</span>
                      <span className="font-semibold text-gray-900">QAR 700</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Qatar Red Crescent</span>
                      <span className="font-semibold text-gray-900">QAR 1,300</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-sm text-red-900">Control Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-red-800 font-mono mb-2">IJR-A3: Late Payment Charity</p>
                <p className="text-sm text-red-900 mb-3">
                  AAOIFI FAS-28 strictly prohibits interest (riba). Late payment penalties MUST go to charity, not IFI profit.
                </p>
                <div className="space-y-2 text-xs text-red-800">
                  <p className="flex items-start">
                    <Ban className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0 text-red-600" />
                    <span><strong>Prohibited:</strong> IFI profiting from late payments</span>
                  </p>
                  <p className="flex items-start">
                    <Heart className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0 text-green-600" />
                    <span><strong>Required:</strong> 100% of penalties to recognized charity</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span><strong>Transparent:</strong> Full audit trail of charity allocations</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Payment List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-red-200">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
                <CardTitle className="flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-red-600" />
                  Rent Payment Tracking
                </CardTitle>
                <CardDescription>
                  Monitor on-time and late payments with automatic charity allocation
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {payments.map((payment) => {
                    return (
                      <div
                        key={payment.id}
                        className={`p-5 rounded-lg border-2 ${
                          payment.status === 'paid-on-time'
                            ? 'bg-green-50 border-green-200'
                            : payment.status === 'paid-late'
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {payment.lesseeName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Unit {payment.unitId} • Invoice {payment.invoiceId}
                            </p>
                          </div>
                          <Badge
                            variant={
                              payment.status === 'paid-on-time' ? 'default' :
                              payment.status === 'paid-late' ? 'secondary' : 'destructive'
                            }
                          >
                            {payment.status === 'paid-on-time' ? 'On Time' :
                             payment.status === 'paid-late' ? 'Paid Late' : 'Overdue'}
                          </Badge>
                        </div>

                        {/* Payment Details */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Rent Amount</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {payment.currency} {payment.amount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Due Date</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {new Date(payment.dueDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Paid Date</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'Not paid'}
                            </p>
                          </div>
                        </div>

                        {/* Late Payment Details */}
                        {payment.daysLate > 0 && (
                          <div className={`pt-4 border-t mb-4 ${
                            payment.status === 'paid-late' ? 'border-blue-300' : 'border-red-300'
                          }`}>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Days Late</p>
                                <p className="text-lg font-bold text-red-600">
                                  {payment.daysLate}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Penalty Rate</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {payment.currency} {payment.penaltyRate}/day
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Total Penalty</p>
                                <p className="text-lg font-bold text-red-600">
                                  {payment.currency} {payment.penaltyAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action / Status */}
                        <div className={`pt-4 border-t ${
                          payment.status === 'paid-on-time' ? 'border-green-300' :
                          payment.status === 'paid-late' ? 'border-blue-300' : 'border-red-300'
                        }`}>
                          {payment.status === 'paid-on-time' && (
                            <div className="flex items-center text-green-800">
                              <CheckCircle2 className="h-5 w-5 mr-2" />
                              <span className="text-sm font-semibold">
                                Rent paid on time. No penalties applied.
                              </span>
                            </div>
                          )}

                          {payment.status === 'paid-late' && payment.charityAllocated && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-blue-800">
                                <Heart className="h-5 w-5 mr-2" />
                                <div>
                                  <p className="text-sm font-semibold">
                                    Penalty allocated to: {payment.charityRecipient}
                                  </p>
                                  <p className="text-xs text-blue-700 mt-1">
                                    QAR {payment.penaltyAmount.toLocaleString()} disbursed to charity (not IFI profit)
                                  </p>
                                </div>
                              </div>
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Allocated
                              </Badge>
                            </div>
                          )}

                          {payment.status === 'overdue' && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-red-800">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                <div>
                                  <p className="text-sm font-semibold">
                                    Payment is {payment.daysLate} days overdue
                                  </p>
                                  <p className="text-xs text-red-700 mt-1">
                                    Penalty accumulating at QAR {payment.penaltyRate}/day (will go to charity upon payment)
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAllocateCharity(payment.id, 'Qatar Charity')}
                                >
                                  Mark as Paid
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Shariah Compliance Alert */}
            <Alert className="bg-red-50 border-red-200">
              <Ban className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">
                <strong>Shariah Compliance Requirement:</strong> Islamic finance strictly prohibits riba (interest).
                Late payment penalties cannot be used to increase IFI profit. Under AAOIFI FAS-28, 100% of penalties
                must be disbursed to recognized charities. This demo automatically enforces this rule, ensuring
                all penalties flow to charitable organizations, not the lessor's income.
              </AlertDescription>
            </Alert>

            {/* Key Benefit */}
            <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Automated Compliance</h3>
                    <p className="text-sm text-green-800 mb-3">
                      The system automatically detects late payments, calculates penalties, and ensures 100%
                      charity allocation. No manual intervention needed - full Shariah compliance guaranteed.
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-green-700">
                      <div className="flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Auto-detection</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Auto-calculation</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Auto-charity allocation</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Full audit trail</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
