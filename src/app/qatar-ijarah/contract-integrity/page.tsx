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
  FileText,
  Users,
  Building2,
  Banknote,
  ArrowRight,
  Shield,
  AlertTriangle,
  XCircle,
  Eye
} from 'lucide-react'

interface ContractCheck {
  id: string
  name: string
  description: string
  status: 'pass' | 'fail' | 'warning'
  details: string
}

export default function ContractIntegrityPage() {
  const router = useRouter()
  const { currentProject, loadDemoData } = useIjarahStore()
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const [contractChecks, setContractChecks] = useState<ContractCheck[]>([
    {
      id: 'check-1',
      name: 'Istisnā\' Contract Presence',
      description: 'IFI → Developer manufacturing contract exists',
      status: 'pass',
      details: 'Valid Istisnā\' contract found between Qatar Islamic Bank (IFI) and Qatar Real Estate Development Co. (Developer) for construction of 40 residential units.'
    },
    {
      id: 'check-2',
      name: 'Ijārah Contract Presence',
      description: 'IFI → Buyer lease contract exists',
      status: 'pass',
      details: 'Valid Ijārah contract found between Qatar Islamic Bank (IFI) and end buyer for forward lease of completed unit.'
    },
    {
      id: 'check-3',
      name: 'Tri-Party Structure Integrity',
      description: 'Three-party relationship properly established',
      status: 'pass',
      details: 'Confirmed tri-party structure: (1) IFI contracts developer for construction, (2) IFI leases to buyer upon completion, (3) Forward lease agreement ties both contracts.'
    },
    {
      id: 'check-4',
      name: 'No Direct Developer-Buyer Contract',
      description: 'Ensures IFI intermediation (QFCRA IBANK 7.5.2)',
      status: 'pass',
      details: 'No direct contractual relationship found between Developer and Buyer. All transactions flow through IFI as required.'
    },
    {
      id: 'check-5',
      name: 'Asset Ownership Sequence',
      description: 'IFI owns asset before leasing',
      status: 'pass',
      details: 'Confirmed: IFI will take ownership of completed unit before Ijārah lease commences. No pre-completion lease found.'
    },
    {
      id: 'check-6',
      name: 'Rent Commencement Clause',
      description: 'Rent only after delivery (AAOIFI SS-9 4/1/3)',
      status: 'pass',
      details: 'Ijārah contract includes explicit clause: "Rent shall not accrue until possession and usufruct are delivered to the lessee." Compliant with AAOIFI SS-9 4/1/3.'
    },
    {
      id: 'check-7',
      name: 'Major Maintenance Clause',
      description: 'Lessor liability for major repairs (AAOIFI SS-9 5/2/6)',
      status: 'pass',
      details: 'Ijārah contract assigns major maintenance to IFI (Lessor) and minor maintenance to Buyer (Lessee). Compliant with Shariah standards.'
    },
    {
      id: 'check-8',
      name: 'Takaful Insurance Clause',
      description: 'Lessor-purchased Takaful (AAOIFI SS-9 5/2/7)',
      status: 'pass',
      details: 'IFI (Lessor) bears cost of Takaful insurance for the leased asset. Buyer is not charged for insurance separately.'
    },
    {
      id: 'check-9',
      name: 'Late Payment Charity Clause',
      description: 'No interest on late payments (AAOIFI FAS-28)',
      status: 'pass',
      details: 'Contract specifies late payment penalty goes to charity, not IFI profit. Compliant with Shariah prohibition on riba.'
    },
    {
      id: 'check-10',
      name: 'Cross-Default Protection',
      description: 'Istisnā\' completion linked to Ijārah validity',
      status: 'pass',
      details: 'Forward lease agreement includes cross-default clause: Ijārah only becomes binding upon completion of Istisnā\' construction.'
    }
  ])

  useEffect(() => {
    if (!currentProject) {
      loadDemoData()
    }
  }, [currentProject, loadDemoData])

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contract data...</p>
        </div>
      </div>
    )
  }

  const passedChecks = contractChecks.filter(c => c.status === 'pass').length
  const totalChecks = contractChecks.length
  const allChecksPassed = passedChecks === totalChecks

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Scene 4: Contract Integrity</h1>
                <p className="text-sm text-gray-600">Tri-Party Structure Validation (QFCRA IBANK 7.5.2)</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={allChecksPassed ? "default" : "destructive"} className="text-sm px-3 py-1">
                {allChecksPassed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    All Checks Passed
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {passedChecks} / {totalChecks} Passed
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Tri-Party Diagram */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-indigo-200">
              <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-indigo-600" />
                  Tri-Party Structure
                </CardTitle>
                <CardDescription>QFCRA IBANK 7.5.2 Requirement</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* IFI (Center) */}
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-2 border-4 border-indigo-600">
                      <Banknote className="h-10 w-10 text-indigo-600" />
                    </div>
                    <p className="font-bold text-indigo-900 text-lg">Islamic Finance Institution</p>
                    <p className="text-xs text-indigo-700">(Qatar Islamic Bank)</p>
                    <Badge className="mt-2 bg-indigo-600">Central Party</Badge>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="h-px w-full bg-indigo-300" />
                  </div>

                  {/* Developer */}
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900 text-sm">Developer</p>
                      <p className="text-xs text-blue-700 mb-2">Qatar Real Estate Dev. Co.</p>
                      <div className="flex items-center text-xs text-blue-800">
                        <FileText className="h-3 w-3 mr-1" />
                        <span className="font-semibold">Istisnā' Contract</span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">IFI → Developer</p>
                    </div>
                  </div>

                  {/* Buyer */}
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-900 text-sm">End Buyer (Lessee)</p>
                      <p className="text-xs text-green-700 mb-2">40 individual buyers</p>
                      <div className="flex items-center text-xs text-green-800">
                        <FileText className="h-3 w-3 mr-1" />
                        <span className="font-semibold">Ijārah Contract</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">IFI → Buyer</p>
                    </div>
                  </div>

                  <Alert className="bg-purple-50 border-purple-200">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-900 text-xs">
                      <strong>Key Requirement:</strong> IFI must be the central party in both contracts.
                      Direct Developer → Buyer contract would violate QFCRA IBANK 7.5.2.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-sm text-indigo-900">Control Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-indigo-800 font-mono mb-2">IJR-A2: Istisnā' Tri-Split Integrity</p>
                <p className="text-sm text-indigo-900">
                  QFCRA IBANK 7.5.2 requires tri-party structure with IFI intermediation to ensure Shariah compliance.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Contract Integrity Checks */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-indigo-200">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-indigo-600" />
                  Automated Contract Validation
                </CardTitle>
                <CardDescription>
                  10 automated checks ensuring QFCRA & AAOIFI compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {contractChecks.map((check) => (
                    <div
                      key={check.id}
                      className={`p-4 rounded-lg border-2 ${
                        check.status === 'pass'
                          ? 'bg-green-50 border-green-200'
                          : check.status === 'fail'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex-shrink-0 mt-0.5">
                            {check.status === 'pass' ? (
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            ) : check.status === 'fail' ? (
                              <XCircle className="h-6 w-6 text-red-600" />
                            ) : (
                              <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {check.name}
                            </h4>
                            <p className="text-sm text-gray-700 mb-2">
                              {check.description}
                            </p>
                            {showDetails === check.id && (
                              <div className={`mt-3 p-3 rounded border text-sm ${
                                check.status === 'pass'
                                  ? 'bg-green-100 border-green-300 text-green-900'
                                  : check.status === 'fail'
                                  ? 'bg-red-100 border-red-300 text-red-900'
                                  : 'bg-yellow-100 border-yellow-300 text-yellow-900'
                              }`}>
                                <p className="font-medium mb-1">Details:</p>
                                <p>{check.details}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge
                            variant={
                              check.status === 'pass' ? 'default' :
                              check.status === 'fail' ? 'destructive' : 'secondary'
                            }
                          >
                            {check.status === 'pass' ? 'PASS' :
                             check.status === 'fail' ? 'FAIL' : 'WARN'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowDetails(showDetails === check.id ? null : check.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contract Flow Diagram */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Flow</CardTitle>
                <CardDescription>How the tri-party structure operates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Istisnā' Contract (Manufacturing)</p>
                      <p className="text-sm text-gray-600 mt-1">
                        IFI contracts with Developer to construct 40 residential units. IFI pays progressively based on milestones.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-700 font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Asset Ownership Transfer</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Upon completion, IFI takes ownership of the completed unit before leasing it out.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700 font-bold">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Ijārah Contract (Lease)</p>
                      <p className="text-sm text-gray-600 mt-1">
                        IFI leases completed unit to end buyer. Rent commences only after delivery of possession and usufruct.
                      </p>
                    </div>
                  </div>

                  <Alert className="mt-4 bg-indigo-50 border-indigo-200">
                    <Shield className="h-4 w-4 text-indigo-600" />
                    <AlertDescription className="text-indigo-900">
                      <strong>Shariah Compliance Key:</strong> The IFI must own the asset before leasing it.
                      This prevents the prohibition of selling what one does not own (bay' al-ma'dum).
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            {allChecksPassed && (
              <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900">Contract Structure Validated!</h3>
                        <p className="text-sm text-green-700">
                          All integrity checks passed. Tri-party structure is QFCRA & AAOIFI compliant.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push('/qatar-ijarah')}
                      className="bg-green-600 hover:bg-green-700"
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
