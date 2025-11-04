/**
 * CONTRACT COLLABORATION PAGE
 * ===========================
 * Comprehensive collaboration view for a single contract.
 *
 * Features:
 * - Contract overview
 * - Subscriber management
 * - Comment threads (contract + steps)
 * - Task list
 * - Activity feed
 * - Tabs for organized view
 *
 * Route: /contracts/[id]/collaborate
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Users,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  Calendar,
  User
} from 'lucide-react'
import { SubscriberList } from '@/components/collaboration/SubscriberList'
import { CommentThread } from '@/components/collaboration/CommentThread'
import { TaskList } from '@/components/collaboration/TaskList'
import { backendClient } from '@/lib/backend-client'
import Link from 'next/link'

// ============================================================================
// TYPES
// ============================================================================

interface ContractInfo {
  contract_id: string
  contract_name: string
  contract_type: string
  status: string
  owner_email: string
  owner_name: string
  created_at: string
  updated_at: string
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ContractCollaborationPage() {
  const params = useParams()
  const contractId = params?.id as string

  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)

  const currentUserEmail = 'current_user@example.com' // TODO: Get from auth
  const currentUserName = 'Current User' // TODO: Get from auth
  const currentUserRole = 'business_team' // TODO: Get from auth

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    if (contractId) {
      loadContractInfo()
    }
  }, [contractId])

  const loadContractInfo = async () => {
    try {
      setLoading(true)

      // Get contract owner
      const subscribersData = await backendClient.api<{
        owner_email: string
      }>(`/api/contracts/${contractId}/subscribers`, { method: 'GET' })

      // Check if current user is owner
      setIsOwner(subscribersData.owner_email === currentUserEmail)

      // TODO: Load contract details from contracts API
      // For now, using mock data
      setContractInfo({
        contract_id: contractId,
        contract_name: `Contract ${contractId}`,
        contract_type: 'Murabaha',
        status: 'In Review',
        owner_email: subscribersData.owner_email || 'unknown@example.com',
        owner_name: 'Contract Owner',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to load contract info:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getContractTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Murabaha: 'bg-blue-100 text-blue-800',
      Mudaraba: 'bg-green-100 text-green-800',
      Musharaka: 'bg-purple-100 text-purple-800',
      Ijara: 'bg-orange-100 text-orange-800',
      Sukuk: 'bg-pink-100 text-pink-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Draft': 'bg-gray-100 text-gray-800',
      'In Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Active': 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12 text-gray-500">
          Loading contract...
        </div>
      </div>
    )
  }

  if (!contractInfo) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Contract Not Found</h2>
          <p className="text-gray-500 mb-4">
            The contract you're looking for doesn't exist or you don't have access.
          </p>
          <Link href="/contracts">
            <Button>Back to Contracts</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/contracts/${contractId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Contract
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8" />
            Collaboration
          </h1>
          <p className="text-gray-600 mt-1">
            {contractInfo.contract_name}
          </p>
        </div>
      </div>

      {/* Contract Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
          <CardDescription>Overview and current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Contract Type</p>
              <Badge className={getContractTypeColor(contractInfo.contract_type)}>
                {contractInfo.contract_type}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <Badge className={getStatusColor(contractInfo.status)}>
                {contractInfo.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Owner</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <p className="font-medium">{contractInfo.owner_name}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="font-medium">
                  {new Date(contractInfo.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Tabs */}
      <Tabs defaultValue="subscribers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscribers">
            <Users className="h-4 w-4 mr-2" />
            Stakeholders
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckCircle className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Calendar className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Stakeholders Tab */}
        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <CardTitle>Contract Stakeholders</CardTitle>
              <CardDescription>
                Owner and subscribers with notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriberList
                contractId={contractId}
                currentUserEmail={currentUserEmail}
                isOwner={isOwner}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4">
          {/* Contract-level Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Comments</CardTitle>
              <CardDescription>
                General discussion about this contract
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommentThread
                contractId={contractId}
                currentUserEmail={currentUserEmail}
                currentUserName={currentUserName}
                currentUserRole={currentUserRole}
                isOwner={isOwner}
              />
            </CardContent>
          </Card>

          {/* Step-specific Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Step-Specific Comments</CardTitle>
              <CardDescription>
                Comments attached to workflow steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Step {stepNumber}</h4>
                    <CommentThread
                      contractId={contractId}
                      stepNumber={stepNumber}
                      currentUserEmail={currentUserEmail}
                      currentUserName={currentUserName}
                      currentUserRole={currentUserRole}
                      isOwner={isOwner}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Contract Tasks</CardTitle>
              <CardDescription>
                Task assignments and tracking for this contract
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList
                contractId={contractId}
                currentUserEmail={currentUserEmail}
                canCreateTasks={isOwner}
                showCreateButton={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>
                Recent changes and updates to this contract
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Activity feed coming soon
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  This will show a timeline of all collaboration events
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stakeholders</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-gray-500">Active collaborators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-gray-500">Total comments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-gray-500">Pending tasks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
