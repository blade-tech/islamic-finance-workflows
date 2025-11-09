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
  XCircle,
  Upload,
  FileText,
  Shield,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  AlertTriangle
} from 'lucide-react'

export default function ProjectSetupPage() {
  const router = useRouter()
  const { currentProject, loadDemoData } = useIjarahStore()
  const [ssbUploaded, setSsbUploaded] = useState(false)
  const [policyManualUploaded, setPolicyManualUploaded] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!currentProject) {
      loadDemoData()
    }
  }, [currentProject, loadDemoData])

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project data...</p>
        </div>
      </div>
    )
  }

  const handleSsbUpload = () => {
    setSsbUploaded(true)
    if (policyManualUploaded) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const handlePolicyManualUpload = () => {
    setPolicyManualUploaded(true)
    if (ssbUploaded) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const ssbApproval = currentProject.ssbApproval
  const authorityApprovals = currentProject.authorityApprovals || []
  const approvedAuthorities = authorityApprovals.filter(a => a.verified).length
  const totalAuthorities = authorityApprovals.length
  const authorityProgress = totalAuthorities > 0 ? (approvedAuthorities / totalAuthorities) * 100 : 0

  const allApprovalsComplete = ssbApproval && authorityProgress === 100 && ssbUploaded && policyManualUploaded

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Scene 1: Project Setup</h1>
                <p className="text-sm text-gray-600">SSB Approval & Authority Verification</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={allApprovalsComplete ? "default" : "secondary"} className="text-sm px-3 py-1">
                {allApprovalsComplete ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Setup Complete
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Pending Approvals
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Alert */}
        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Evidence uploaded successfully! All approvals verified.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Project Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Project Name</p>
                  <p className="font-semibold text-gray-900">{currentProject.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </p>
                  <p className="text-gray-900">{currentProject.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Project Value
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {currentProject.currency} {currentProject.projectValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    Total Units
                  </p>
                  <p className="text-gray-900">{currentProject.totalUnits} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Expected Completion
                  </p>
                  <p className="text-gray-900">
                    {new Date(currentProject.expectedCompletionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Developer</p>
                  <p className="text-gray-900">{currentProject.developerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge variant="outline" className="capitalize">
                    {currentProject.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm text-blue-900">Control Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-blue-800 font-mono mb-2">IJR-A4: SSB Approvals</p>
                <p className="text-sm text-blue-900">
                  QFCRA IBANK 5.4.2 requires unanimous SSB approval for Islamic finance products.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Approvals */}
          <div className="lg:col-span-2 space-y-6">
            {/* SSB Approval Card */}
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-green-600" />
                  Shariah Supervisory Board (SSB) Approval
                </CardTitle>
                <CardDescription>
                  Required by QFCRA IBANK 5.4.2 - Unanimous SSB approval for product structure
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {ssbApproval ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Decision Date</p>
                        <p className="font-semibold">
                          {new Date(ssbApproval.decisionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Unanimous Decision</p>
                        <Badge variant={ssbApproval.unanimous ? "default" : "destructive"}>
                          {ssbApproval.unanimous ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Yes
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              No
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Required Evidence
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            {ssbUploaded ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                            )}
                            <div>
                              <p className="text-sm font-medium">SSB Fatwa Document</p>
                              <p className="text-xs text-gray-600">Signed approval from all SSB members</p>
                            </div>
                          </div>
                          {!ssbUploaded && (
                            <Button size="sm" onClick={handleSsbUpload}>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          )}
                          {ssbUploaded && (
                            <Badge variant="default">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            {policyManualUploaded ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                            )}
                            <div>
                              <p className="text-sm font-medium">Shariah Policy Manual</p>
                              <p className="text-xs text-gray-600">Comprehensive policy documentation</p>
                            </div>
                          </div>
                          {!policyManualUploaded && (
                            <Button size="sm" onClick={handlePolicyManualUpload}>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          )}
                          {policyManualUploaded && (
                            <Badge variant="default">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No SSB approval found for this project. Please obtain SSB approval before proceeding.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Authority Approvals Card */}
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-6 w-6 mr-2 text-blue-600" />
                    Authority Approvals
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {approvedAuthorities} / {totalAuthorities} Verified
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Required regulatory approvals from Qatar authorities
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">Approval Progress</p>
                    <p className="text-sm text-gray-600">{Math.round(authorityProgress)}%</p>
                  </div>
                  <Progress value={authorityProgress} className="h-2" />
                </div>

                <div className="space-y-3">
                  {authorityApprovals.map((approval) => (
                    <div
                      key={approval.id}
                      className={`p-4 rounded-lg border-2 ${
                        approval.verified
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {approval.verified ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-400" />
                            )}
                            <h4 className="font-semibold text-gray-900">
                              {approval.authority.replace(/_/g, ' ')}
                            </h4>
                          </div>
                          <div className="ml-7 space-y-1 text-sm">
                            <p className="text-gray-700">
                              <span className="font-medium">Type:</span> {approval.approvalType}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Number:</span> {approval.approvalNumber}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Date:</span>{' '}
                              {new Date(approval.approvalDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            {approval.expiryDate && (
                              <p className="text-gray-700">
                                <span className="font-medium">Expires:</span>{' '}
                                {new Date(approval.expiryDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={approval.verified ? 'default' : 'secondary'}
                          className="ml-2"
                        >
                          {approval.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            {allApprovalsComplete && (
              <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900">Project Setup Complete!</h3>
                        <p className="text-sm text-green-700">
                          All approvals verified. Ready to proceed to escrow setup.
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
