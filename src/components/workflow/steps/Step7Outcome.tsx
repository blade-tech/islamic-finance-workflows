'use client'

/**
 * STEP 7: OUTCOME & DOWNLOAD
 * ===========================
 * View final document and download in multiple formats.
 */

import { useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, FileText, Info } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export function Step7Outcome() {
  const execution = useWorkflowStore((state) => state.execution)
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'docx' | 'markdown'>('pdf')

  const handleDownload = (format: 'pdf' | 'docx' | 'markdown') => {
    // TODO: Implement download
    console.log('Download:', format)
  }

  return (
    <div className="space-y-6">
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>What's Happening in Step 7</AlertTitle>
        <AlertDescription>
          Review your generated document and download it in PDF, DOCX, or Markdown format.
        </AlertDescription>
      </Alert>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle>Download Document</CardTitle>
          <CardDescription>
            Choose your preferred format
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={() => handleDownload('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={() => handleDownload('docx')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download DOCX
          </Button>
          <Button onClick={() => handleDownload('markdown')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Markdown
          </Button>
        </CardContent>
      </Card>

      {/* Document Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Document Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="markdown">
            <TabsList>
              <TabsTrigger value="markdown">Markdown</TabsTrigger>
              <TabsTrigger value="rendered">Rendered</TabsTrigger>
            </TabsList>
            <TabsContent value="markdown">
              <ScrollArea className="h-96 w-full rounded-md border p-4">
                <pre className="text-sm whitespace-pre-wrap">
                  {execution?.finalDocument || 'No document generated yet.'}
                </pre>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="rendered">
              <ScrollArea className="h-96 w-full rounded-md border p-4">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {execution?.finalDocument || 'No document generated yet.'}
                  </ReactMarkdown>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Generated Files */}
      {execution && execution.generatedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {execution.generatedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">{file.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.filesize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
