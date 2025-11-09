'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function QatarIjarahV2Page() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to tasks (default view)
    router.push('/qatar-ijarah-v2/tasks')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    </div>
  )
}
