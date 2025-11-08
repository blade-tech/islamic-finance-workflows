/**
 * SCREEN 2: MY TASKS (AGENT INBOX)
 * Task-first view showing AI-generated actions
 * Demonstrates "Do It For Me" and "Ask Why" capabilities
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  FileText,
  Bot,
  MessageCircleQuestion,
  Play
} from 'lucide-react'
import {
  mockTasks,
  getTasksByPriority,
  getTasksByStatus,
  getCriticalTasks,
  getBlockedTasks
} from '@/lib/mock-data/tasks'
import { bucketTheme } from '@/lib/control-library'
import { TaskLineage } from '@/components/workflow/TaskLineage'

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'critical' | 'blocked' | 'pending'>('all')

  const filteredTasks = (() => {
    switch (filter) {
      case 'critical':
        return getCriticalTasks()
      case 'blocked':
        return getBlockedTasks()
      case 'pending':
        return getTasksByStatus('in_progress')
      default:
        return mockTasks
    }
  })()

  const taskCounts = {
    all: mockTasks.length,
    critical: getCriticalTasks().length,
    blocked: getBlockedTasks().length,
    pending: getTasksByStatus('in_progress').length
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'red'
      case 'high': return 'orange'
      case 'medium': return 'yellow'
      case 'low': return 'green'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Tasks</h1>
        <p className="text-gray-600">
          AI-prioritized compliance tasks across your portfolio
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200">
        {(['all', 'critical', 'blocked', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize
              ${filter === f
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {f} ({taskCounts[f]})
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const priorityColor = getPriorityColor(task.priority)
          const isSelected = selectedTask === task.id

          return (
            <div
              key={task.id}
              className={`
                bg-white rounded-lg border-2 transition-all
                ${isSelected ? 'border-purple-300 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              {/* Task Header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => setSelectedTask(isSelected ? null : task.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(task.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${priorityColor}-100 text-${priorityColor}-800`}>
                          {task.priority}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {task.controlId}
                        </span>
                        <Link
                          href={`/ai-native/deals/${task.dealId}`}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {task.dealId}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </div>

                      {/* Task Summary */}
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {task.summary}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {task.dealName}
                      </p>

                      {/* AI Insight */}
                      {task.aiInsight && (
                        <div className="flex items-start space-x-2 mt-3 bg-purple-50 rounded-lg p-3">
                          <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{task.aiInsight}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {task.availableActions.includes('do_it_for_me') && task.proposedFix && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!task.proposedFix) return
                          alert(`Agent will execute ${task.proposedFix.actions.length} actions with ${task.proposedFix.confidence}% confidence`)
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors whitespace-nowrap flex items-center space-x-2"
                      >
                        <Bot className="h-4 w-4" />
                        <span>Do It For Me</span>
                      </button>
                    )}
                    {task.availableActions.includes('ask_why') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTask(task.id)
                        }}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors whitespace-nowrap flex items-center space-x-2"
                      >
                        <MessageCircleQuestion className="h-4 w-4" />
                        <span>Ask Why</span>
                      </button>
                    )}
                    <div onClick={(e) => e.stopPropagation()}>
                      <TaskLineage taskId={task.controlId} />
                    </div>
                  </div>
                </div>

                {/* Evidence Count */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span>{task.evidence.length} evidence items</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isSelected && (
                <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
                  {/* Rule */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Compliance Rule
                    </h4>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {task.rule.standard}
                        </span>
                        {task.rule.citation_url && (
                          <a
                            href={task.rule.citation_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                          >
                            View Standard
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{task.rule.text}</p>
                    </div>
                  </div>

                  {/* Evidence */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Evidence ({task.evidence.length})
                    </h4>
                    <div className="space-y-2">
                      {task.evidence.map((e, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {e.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {e.source} • {e.status}
                              </p>
                            </div>
                          </div>
                          {e.status === 'verified' && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                          {e.status === 'missing' && (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          {e.status === 'stale' && (
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proposed Fix */}
                  {task.proposedFix && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Agent Proposed Fix ({task.proposedFix.confidence}% confidence)
                      </h4>
                      <div className="bg-white rounded-lg border border-purple-200 p-4">
                        <p className="text-sm text-gray-700 mb-3">
                          {task.proposedFix.description}
                        </p>

                        <div className="space-y-2">
                          {task.proposedFix.actions.map((action, idx) => (
                            <div
                              key={idx}
                              className="flex items-start space-x-3 bg-purple-50 rounded-lg p-3"
                            >
                              <div className="flex-shrink-0">
                                <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                                  <span className="text-xs font-medium text-purple-700">
                                    {idx + 1}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 capitalize mb-1">
                                  {action.type.replace(/_/g, ' ')}
                                </p>
                                {action.preview && (
                                  <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                                    {action.preview}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center space-x-2">
                          <button
                            onClick={() => alert('Agent executing actions...')}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                          >
                            <Play className="h-4 w-4" />
                            <span>Execute All Actions</span>
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            Review Drafts
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No {filter} tasks
          </h3>
          <p className="text-gray-600">
            All tasks in this category have been completed
          </p>
        </div>
      )}
    </div>
  )
}
