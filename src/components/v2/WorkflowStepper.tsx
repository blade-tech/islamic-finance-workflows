'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Circle, AlertTriangle, ArrowRight, User, Bot } from 'lucide-react'

export interface WorkflowStep {
  id: string
  title: string
  description: string
  status: 'done' | 'in_review' | 'todo' | 'blocked'
  actor: 'agent' | 'human'
  actorName?: string
  completedAt?: string
  duration?: string
  hasTask?: boolean
  taskUrl?: string
}

export interface WorkflowStepperProps {
  steps: WorkflowStep[]
  currentStepId: string
}

export function WorkflowStepper({ steps, currentStepId }: WorkflowStepperProps) {
  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'in_review':
        return <Clock className="h-5 w-5 text-orange-600 animate-pulse" />
      case 'todo':
        return <Circle className="h-5 w-5 text-gray-400" />
      case 'blocked':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
    }
  }

  const getStepColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-50 border-green-200'
      case 'in_review':
        return 'bg-orange-50 border-orange-200'
      case 'todo':
        return 'bg-gray-50 border-gray-200'
      case 'blocked':
        return 'bg-red-50 border-red-200'
    }
  }

  const getStatusBadge = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'done':
        return <Badge className="bg-green-600">Done</Badge>
      case 'in_review':
        return <Badge className="bg-orange-600">In Review</Badge>
      case 'todo':
        return <Badge variant="outline">To Do</Badge>
      case 'blocked':
        return <Badge variant="destructive">Blocked</Badge>
    }
  }

  return (
    <div className="space-y-3">
      {steps.map((step, idx) => {
        const isCurrent = step.id === currentStepId
        const isLast = idx === steps.length - 1

        return (
          <div key={step.id} className="relative">
            {/* Connector Line */}
            {!isLast && (
              <div
                className={`absolute left-[22px] top-[40px] bottom-[-12px] w-0.5 ${
                  step.status === 'done' ? 'bg-green-300' : 'bg-gray-300'
                }`}
              />
            )}

            {/* Step Card */}
            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrent ? 'ring-2 ring-blue-500 shadow-md' : ''
              } ${getStepColor(step.status)}`}
            >
              <div className="flex items-start justify-between">
                {/* Left: Icon + Content */}
                <div className="flex items-start space-x-3 flex-1">
                  {/* Step Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getStepIcon(step.status)}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {idx + 1}. {step.title}
                      </h4>
                      {isCurrent && (
                        <Badge variant="outline" className="text-xs">
                          YOU ARE HERE
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 mb-2">{step.description}</p>

                    {/* Actor Info */}
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        {step.actor === 'agent' ? (
                          <>
                            <Bot className="h-3 w-3 text-purple-600" />
                            <span className="text-gray-600">Agent</span>
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 text-blue-600" />
                            <span className="text-gray-600">
                              {step.actorName || 'Human'}
                            </span>
                          </>
                        )}
                      </div>

                      {step.completedAt && (
                        <div className="text-gray-500">
                          Completed: {new Date(step.completedAt).toLocaleString()}
                        </div>
                      )}

                      {step.duration && (
                        <div className="text-gray-500">
                          Duration: {step.duration}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status Badge + Action */}
                <div className="flex flex-col items-end space-y-2 ml-4">
                  {getStatusBadge(step.status)}
                  {step.hasTask && step.taskUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={step.taskUrl}>
                        Go to Task
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
