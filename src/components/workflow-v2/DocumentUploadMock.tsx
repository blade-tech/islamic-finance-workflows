'use client'

/**
 * MOCK DOCUMENT UPLOAD COMPONENT
 * ===============================
 * Visual-only upload component with animated states
 * No backend integration - purely for demonstration
 */

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, File, CheckCircle2, Clock, FileText } from 'lucide-react'

interface MockDocument {
  id: string
  name: string
  size: string
  type: string
  status: 'uploading' | 'processing' | 'complete'
  progress: number
}

export function DocumentUploadMock() {
  const [documents, setDocuments] = useState<MockDocument[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const simulateUpload = (fileName: string, fileSize: string, fileType: string) => {
    const docId = Math.random().toString(36).substr(2, 9)
    const newDoc: MockDocument = {
      id: docId,
      name: fileName,
      size: fileSize,
      type: fileType,
      status: 'uploading',
      progress: 0
    }

    setDocuments(prev => [...prev, newDoc])

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === docId && doc.status === 'uploading') {
          const newProgress = doc.progress + 15
          if (newProgress >= 100) {
            clearInterval(uploadInterval)
            // Transition to processing after a delay
            setTimeout(() => {
              setDocuments(prev2 => prev2.map(d =>
                d.id === docId ? { ...d, status: 'processing' as const, progress: 0 } : d
              ))
              simulateProcessing(docId)
            }, 500)
            return { ...doc, progress: 100 }
          }
          return { ...doc, progress: newProgress }
        }
        return doc
      }))
    }, 300)
  }

  const simulateProcessing = (docId: string) => {
    const processingInterval = setInterval(() => {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === docId && doc.status === 'processing') {
          const newProgress = doc.progress + 20
          if (newProgress >= 100) {
            clearInterval(processingInterval)
            return { ...doc, status: 'complete' as const, progress: 100 }
          }
          return { ...doc, progress: newProgress }
        }
        return doc
      }))
    }, 400)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const sizeInKB = (file.size / 1024).toFixed(1)
      simulateUpload(file.name, `${sizeInKB} KB`, file.type)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    Array.from(files).forEach(file => {
      const sizeInKB = (file.size / 1024).toFixed(1)
      simulateUpload(file.name, `${sizeInKB} KB`, file.type)
    })
  }

  const handleQuickDemo = () => {
    const demoFiles = [
      { name: 'Sukuk_Offering_Memorandum.pdf', size: '2.4 MB', type: 'application/pdf' },
      { name: 'Shariah_Compliance_Certificate.pdf', size: '1.1 MB', type: 'application/pdf' },
      { name: 'Legal_Opinion.pdf', size: '856 KB', type: 'application/pdf' }
    ]

    demoFiles.forEach((file, index) => {
      setTimeout(() => {
        simulateUpload(file.name, file.size, file.type)
      }, index * 800)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Document Upload (Demo)
        </h3>
        <p className="text-gray-600 text-sm">
          Upload compliance documents. This is a visual demo only - no files are actually uploaded.
        </p>
      </div>

      {/* Upload Dropzone */}
      <Card
        className={`
          p-8 border-2 border-dashed transition-all
          ${isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-1">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              PDF, DOCX, or TXT files (Mock upload - no actual file processing)
            </p>
          </div>
          <div className="flex gap-3">
            <label htmlFor="file-upload">
              <Button type="button" variant="outline" className="cursor-pointer">
                <File className="h-4 w-4 mr-2" />
                Select Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
            <Button onClick={handleQuickDemo} className="bg-purple-600 hover:bg-purple-700">
              Quick Demo (3 files)
            </Button>
          </div>
        </div>
      </Card>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Uploaded Documents</h4>
          {documents.map(doc => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${doc.status === 'complete'
                    ? 'bg-green-100'
                    : doc.status === 'processing'
                    ? 'bg-blue-100'
                    : 'bg-purple-100'
                  }
                `}>
                  {doc.status === 'complete' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : doc.status === 'processing' ? (
                    <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
                  ) : (
                    <FileText className="h-5 w-5 text-purple-600" />
                  )}
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                    <span className={`
                      text-xs font-semibold px-2 py-1 rounded
                      ${doc.status === 'complete'
                        ? 'bg-green-100 text-green-700'
                        : doc.status === 'processing'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                      }
                    `}>
                      {doc.status === 'complete'
                        ? 'Complete'
                        : doc.status === 'processing'
                        ? 'Processing...'
                        : 'Uploading...'
                      }
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{doc.size}</p>

                  {/* Progress Bar */}
                  {doc.status !== 'complete' && (
                    <div className="space-y-1">
                      <Progress value={doc.progress} className="h-2" />
                      <p className="text-xs text-gray-500">{doc.progress}%</p>
                    </div>
                  )}

                  {/* Complete State */}
                  {doc.status === 'complete' && (
                    <div className="text-xs text-green-600 font-medium">
                      ✓ Document validated and indexed
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {documents.length > 0 && (
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Documents:</span>
            <span className="font-semibold text-gray-900">{documents.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Completed:</span>
            <span className="font-semibold text-green-600">
              {documents.filter(d => d.status === 'complete').length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
