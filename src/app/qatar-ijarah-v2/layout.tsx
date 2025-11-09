'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckSquare, Workflow, Map, ArrowLeft, User } from 'lucide-react'

const navigation = [
  { name: 'My Tasks', href: '/qatar-ijarah-v2/tasks', icon: CheckSquare },
  { name: 'Workflow Runs', href: '/qatar-ijarah-v2/runs', icon: Workflow },
  { name: 'Big Picture', href: '/qatar-ijarah-v2/map', icon: Map },
]

const roles = [
  { value: 'validator', label: 'Validator', description: 'Sign CoV-VCs' },
  { value: 'compliance', label: 'Compliance Officer', description: 'Approve mints' },
  { value: 'evidence', label: 'Evidence Custodian', description: 'Upload documents' },
  { value: 'manager', label: 'Project Manager', description: 'View all' },
]

export default function QatarIjarahV2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [selectedRole, setSelectedRole] = useState('compliance')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Top Navigation */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back + Title */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center">
                  Qatar Ijārah V2
                  <Badge className="ml-2 bg-purple-600">Task-First UX</Badge>
                </h1>
                <p className="text-xs text-gray-600">Pearl Towers Project</p>
              </div>
            </div>

            {/* Right: Role Picker + Compare */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600" />
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <p className="font-semibold">{role.label}</p>
                          <p className="text-xs text-gray-600">{role.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href="/qatar-ijarah">
                  Compare with V1 →
                </Link>
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 border-t">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (pathname === '/qatar-ijarah-v2' && item.href === '/qatar-ijarah-v2/tasks')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="role-context" data-role={selectedRole}>
          {children}
        </div>
      </div>
    </div>
  )
}
