/**
 * API CALL LOGGER
 * ===============
 * Utility for logging all API calls with visual indicators
 *
 * CRITICAL: Provides transparency about API call status
 * - ✅ Success (green)
 * - ❌ Error (red)
 * - 🎭 Mock (orange)
 *
 * Used for debugging and testing to see exactly what's happening.
 */

export type ApiCallStatus = 'success' | 'error' | 'mock'

export interface ApiCallLogEntry {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  status: ApiCallStatus
  timestamp: string
  duration?: number
  details?: any
  error?: Error | string
}

// In-memory log for displaying in UI
const apiCallLog: ApiCallLogEntry[] = []
const MAX_LOG_SIZE = 100

/**
 * Log an API call with color-coded console output
 */
export function logApiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  status: ApiCallStatus,
  details?: {
    duration?: number
    data?: any
    error?: Error | string
  }
) {
  const emoji = {
    success: '✅',
    error: '❌',
    mock: '🎭',
  }[status]

  const color = {
    success: 'color: #22c55e; font-weight: bold',
    error: 'color: #ef4444; font-weight: bold',
    mock: 'color: #f97316; font-weight: bold',
  }[status]

  const entry: ApiCallLogEntry = {
    endpoint,
    method,
    status,
    timestamp: new Date().toISOString(),
    duration: details?.duration,
    details: details?.data,
    error: details?.error,
  }

  // Add to in-memory log
  apiCallLog.push(entry)
  if (apiCallLog.length > MAX_LOG_SIZE) {
    apiCallLog.shift() // Remove oldest entry
  }

  // Console output with collapsible group
  console.groupCollapsed(
    `%c${emoji} [${status.toUpperCase()}] ${method} ${endpoint}`,
    color
  )
  console.log('Status:', status)
  console.log('Endpoint:', endpoint)
  console.log('Method:', method)
  console.log('Timestamp:', entry.timestamp)

  if (details?.duration) {
    console.log('Duration:', `${details.duration}ms`)
  }

  if (details?.data) {
    console.log('Data:', details.data)
  }

  if (details?.error) {
    console.error('Error:', details.error)
  }

  console.groupEnd()

  // Emit event for UI listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('api-call-logged', {
        detail: entry,
      })
    )
  }
}

/**
 * Get all logged API calls
 */
export function getApiCallLog(): ApiCallLogEntry[] {
  return [...apiCallLog]
}

/**
 * Clear the API call log
 */
export function clearApiCallLog() {
  apiCallLog.length = 0
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('api-log-cleared'))
  }
}

/**
 * Get statistics about API calls
 */
export function getApiCallStats() {
  const total = apiCallLog.length
  const success = apiCallLog.filter((e) => e.status === 'success').length
  const error = apiCallLog.filter((e) => e.status === 'error').length
  const mock = apiCallLog.filter((e) => e.status === 'mock').length

  return {
    total,
    success,
    error,
    mock,
    successRate: total > 0 ? (success / total) * 100 : 0,
    mockRate: total > 0 ? (mock / total) * 100 : 0,
  }
}
