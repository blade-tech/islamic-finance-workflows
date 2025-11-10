'use client'

/**
 * DOCUMENT UPLOAD COMPONENT
 * ==========================
 * Drag-and-drop file upload component for compliance documents
 *
 * Features:
 * - Drag and drop file upload
 * - Click to browse file selection
 * - Support for PDF, DOCX, TXT files
 * - Quick demo mode with mock files
 * - Visual feedback for drag states
 */

import React, { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText } from 'lucide-react'

interface DocumentUploadProps {
  onFilesSelected?: (files: File[]) => void
  onQuickDemo?: () => void
  accept?: string
  maxFiles?: number
  className?: string
}

export function DocumentUpload({
  onFilesSelected,
  onQuickDemo,
  accept = '.pdf,.docx,.txt',
  maxFiles = 10,
  className = ''
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter(file => {
      const ext = file.name.toLowerCase()
      return ext.endsWith('.pdf') || ext.endsWith('.docx') || ext.endsWith('.txt')
    })

    if (validFiles.length > 0) {
      const newFiles = [...files, ...validFiles].slice(0, maxFiles)
      setFiles(newFiles)
      onFilesSelected?.(newFiles)
    }
  }, [files, maxFiles, onFilesSelected])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      const newFiles = [...files, ...selectedFiles].slice(0, maxFiles)
      setFiles(newFiles)
      onFilesSelected?.(newFiles)
    }
  }, [files, maxFiles, onFilesSelected])

  const handleQuickDemo = useCallback(() => {
    // Mock demo files
    const mockFiles = [
      new File([''], 'Mudarabah_Contract.pdf', { type: 'application/pdf' }),
      new File([''], 'Capital_Delivery_Receipt.pdf', { type: 'application/pdf' }),
      new File([''], 'Shariah_Board_Approval.pdf', { type: 'application/pdf' })
    ]
    setFiles(mockFiles)
    onQuickDemo?.()
    onFilesSelected?.(mockFiles)
  }, [onQuickDemo, onFilesSelected])

  return (
    <div className={className}>
      <Card
        className={`border-2 border-dashed transition-all ${
          isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-12 text-center">
          {/* Upload Icon */}
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <Upload className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          {/* Instructions */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            PDF, DOCX, or TXT files (Mock upload - no actual file processing)
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-input')?.click()}
              className="relative"
            >
              <FileText className="h-4 w-4 mr-2" />
              Select Files
              <input
                id="file-input"
                type="file"
                multiple
                accept={accept}
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
            <Button
              onClick={handleQuickDemo}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Quick Demo (3 files)
            </Button>
          </div>

          {/* Selected Files Display */}
          {files.length > 0 && (
            <div className="mt-6 text-left">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Selected Files ({files.length})
              </h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200"
                  >
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
