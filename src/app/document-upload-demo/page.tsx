'use client'

/**
 * DOCUMENT UPLOAD DEMO PAGE
 * ==========================
 * Demonstrates the mock document upload component
 */

import { DocumentUploadMock } from '@/components/workflow-v2/DocumentUploadMock'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DocumentUploadDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/workflow-v2-demo">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workflow
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Upload Demo
          </h1>
          <p className="text-gray-600">
            Visual demonstration of document upload with animated states. No files are actually uploaded - this is a front-end only mockup.
          </p>
        </div>

        {/* Upload Component */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <DocumentUploadMock />
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Demo Features</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Drag and drop file upload interface</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Animated upload progress (0-100%)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Processing state with animation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Completion confirmation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>"Quick Demo" button to simulate 3 documents uploading</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Document status tracking (Uploading → Processing → Complete)</span>
            </li>
          </ul>
        </div>

        {/* Integration Note */}
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-900">
            <strong>Integration Note:</strong> This component can be integrated into the workflow wizard as a separate step
            or used standalone for document collection. The animation demonstrates the user experience without requiring backend integration.
          </p>
        </div>
      </div>
    </div>
  )
}
