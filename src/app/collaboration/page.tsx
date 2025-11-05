/**
 * COLLABORATION HUB
 * =================
 * Central navigation page for all Vanta-inspired collaboration features.
 *
 * Features:
 * - Quick links to all collaboration pages
 * - Feature overview cards
 * - Getting started guide
 * - Demo contract link
 *
 * Route: /collaboration
 */

'use client'

import { CollaborationNav } from '@/components/layout/CollaborationNav'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Bell,
  CheckCircle,
  MessageSquare,
  Users,
  AtSign,
  Settings,
  FileText,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

// ============================================================================
// FEATURE CARDS DATA
// ============================================================================

const FEATURES = [
  {
    title: 'Notifications',
    description: 'Real-time updates on tasks, comments, and contract changes',
    icon: Bell,
    href: '/notifications',
    color: 'blue',
    stats: 'Multi-channel delivery (email, in-app, webhook)',
    actions: [
      { label: 'View Notifications', href: '/notifications' },
      { label: 'Configure Preferences', href: '/notifications/preferences' }
    ]
  },
  {
    title: 'Task Management',
    description: 'Assign and track tasks with priorities and due dates',
    icon: CheckCircle,
    href: '/tasks',
    color: 'green',
    stats: 'Status tracking: pending → in progress → completed',
    actions: [
      { label: 'View My Tasks', href: '/tasks' }
    ]
  },
  {
    title: 'Comments & Mentions',
    description: 'Discuss contracts with @mentions and threaded conversations',
    icon: MessageSquare,
    href: '/mentions',
    color: 'purple',
    stats: 'Markdown support with automatic @email extraction',
    actions: [
      { label: 'View My Mentions', href: '/mentions' }
    ]
  },
  {
    title: 'Stakeholder Management',
    description: 'Manage contract owners and subscribers (up to 10 per contract)',
    icon: Users,
    href: '/contracts/contract-001/collaborate',
    color: 'orange',
    stats: '5 roles: Business, Shariah, Legal, Compliance, Finance',
    actions: [
      { label: 'View Demo Contract', href: '/contracts/contract-001/collaborate' }
    ]
  }
]

const ROLE_DASHBOARDS = [
  {
    role: 'business-team',
    label: 'Business Team',
    description: 'Contract creation and business operations',
    color: 'blue'
  },
  {
    role: 'shariah-advisor',
    label: 'Shariah Advisor',
    description: 'Islamic compliance review',
    color: 'green'
  },
  {
    role: 'legal-counsel',
    label: 'Legal Counsel',
    description: 'Legal review and regulatory compliance',
    color: 'purple'
  },
  {
    role: 'compliance-manager',
    label: 'Compliance Manager',
    description: 'Regulatory compliance monitoring',
    color: 'orange'
  },
  {
    role: 'finance-team',
    label: 'Finance Team',
    description: 'Financial review and approval',
    color: 'pink'
  }
]

// ============================================================================
// COMPONENT
// ============================================================================

export default function CollaborationHubPage() {
  return (
    <>
      <CollaborationNav />
      <div className="container mx-auto py-8 max-w-7xl space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          Vanta-Inspired Collaboration Features
        </div>
        <h1 className="text-4xl font-bold">
          Collaboration Hub
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Multi-stakeholder collaboration platform for Islamic finance workflows.
          Manage contracts, track tasks, and coordinate with your team.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Bell className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm text-gray-500">Notification Types</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-gray-500">Stakeholder Roles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm text-gray-500">Task Priorities</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-500">Notification Channels</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-${feature.color}-100`}>
                      <Icon className={`h-6 w-6 text-${feature.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {feature.description}
                      </CardDescription>
                      <p className="text-xs text-gray-500 mt-2">
                        {feature.stats}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {feature.actions.map((action) => (
                      <Link key={action.href} href={action.href}>
                        <Button variant="outline" size="sm">
                          {action.label}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Role-Based Dashboards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Role-Based Dashboards</h2>
        <Card>
          <CardHeader>
            <CardTitle>Personalized Views for Each Stakeholder</CardTitle>
            <CardDescription>
              Each role has a customized dashboard with relevant tasks, contracts, and quick actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROLE_DASHBOARDS.map((dashboard) => (
                <Link key={dashboard.role} href={`/dashboard/${dashboard.role}`}>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <h4 className="font-medium mb-1">{dashboard.label}</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {dashboard.description}
                    </p>
                    <Button variant="ghost" size="sm" className="w-full">
                      View Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Quick guide to using collaboration features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">For Contract Owners</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Add subscribers to your contract (max 10)</li>
                <li>2. Assign tasks with priorities and due dates</li>
                <li>3. Use comments to discuss specific steps</li>
                <li>4. Monitor progress via notifications</li>
                <li>5. Transfer ownership if needed</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-3">For Team Members</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Check your role-based dashboard daily</li>
                <li>2. Review tasks in "My Tasks" page</li>
                <li>3. Respond to @mentions in comments</li>
                <li>4. Configure notification preferences</li>
                <li>5. Update task status as you work</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Contract CTA */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Try the Demo Contract
          </CardTitle>
          <CardDescription>
            Explore all collaboration features with pre-populated mock data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Link href="/contracts/contract-001/collaborate">
              <Button>
                Open Demo Contract
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard/business-team">
              <Button variant="outline">
                View Dashboard Example
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints Reference */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            32 REST API endpoints available for integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Collaboration (6 endpoints)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• POST /api/contracts/{'{id}'}/subscribers</li>
                <li>• GET /api/contracts/{'{id}'}/subscribers</li>
                <li>• DELETE /api/contracts/{'{id}'}/subscribers/{'{email}'}</li>
                <li>• PUT /api/contracts/{'{id}'}/owner</li>
                <li>• GET /api/users/{'{email}'}/contracts</li>
                <li>• GET /api/contracts/{'{id}'}/permissions/{'{email}'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Comments (9 endpoints)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• POST /api/contracts/{'{id}'}/comments</li>
                <li>• GET /api/contracts/{'{id}'}/comments</li>
                <li>• GET /api/comments/{'{id}'}</li>
                <li>• PUT /api/comments/{'{id}'}</li>
                <li>• DELETE /api/comments/{'{id}'}</li>
                <li>• And 4 more...</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tasks (9 endpoints)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• POST /api/contracts/{'{id}'}/tasks</li>
                <li>• GET /api/contracts/{'{id}'}/tasks</li>
                <li>• GET /api/users/{'{email}'}/tasks</li>
                <li>• PUT /api/tasks/{'{id}'}/status</li>
                <li>• DELETE /api/tasks/{'{id}'}</li>
                <li>• And 4 more...</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Notifications (8 endpoints)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• GET /api/notifications</li>
                <li>• GET /api/notifications/{'{id}'}</li>
                <li>• PUT /api/notifications/{'{id}'}/read</li>
                <li>• DELETE /api/notifications/{'{id}'}</li>
                <li>• GET/PUT /api/notifications/preferences</li>
                <li>• And 3 more...</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <Link href="http://localhost:8000/docs" target="_blank">
              <Button variant="outline" size="sm">
                View Full API Documentation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
