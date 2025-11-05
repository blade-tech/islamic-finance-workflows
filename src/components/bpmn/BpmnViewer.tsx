'use client'

/**
 * BPMN VIEWER COMPONENT
 * =====================
 * React wrapper for bpmn-js Viewer library
 *
 * Features:
 * - Renders BPMN 2.0 XML diagrams
 * - Read-only viewer (no editing)
 * - Zoom controls (zoom in, zoom out, fit to viewport)
 * - Click handler for element selection
 * - Responsive container
 *
 * Usage:
 * ```tsx
 * <BpmnViewer
 *   xml={bpmnXmlString}
 *   onElementClick={(elementId, element) => console.log(elementId)}
 *   height="600px"
 * />
 * ```
 */

import { useEffect, useRef, useState } from 'react'
import BpmnJS from 'bpmn-js/lib/Viewer'

// Import bpmn-js styles
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'

interface BpmnViewerProps {
  xml: string
  onElementClick?: (elementId: string, element: any) => void
  height?: string
  className?: string
}

export function BpmnViewer({
  xml,
  onElementClick,
  height = '600px',
  className = ''
}: BpmnViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<BpmnJS | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize viewer
    const viewer = new BpmnJS({
      container: containerRef.current,
      keyboard: { bindTo: document },
      // Add minimal modules for viewing
      additionalModules: []
    })

    viewerRef.current = viewer

    // Import BPMN XML
    const importDiagram = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('[BPMN Viewer] Importing XML...', xml.substring(0, 200))

        const result = await viewer.importXML(xml)
        console.log('[BPMN Viewer] Import result:', result)

        // Fit diagram to viewport
        const canvas = viewer.get('canvas') as any
        canvas.zoom('fit-viewport', 'auto')

        console.log('[BPMN Viewer] Successfully loaded and fitted diagram')
        setLoading(false)
        setError(null) // Explicitly clear any previous error state
      } catch (err) {
        console.error('[BPMN Viewer] Failed to import BPMN diagram:', err)
        console.log('[BPMN Viewer] XML that failed:', xml)
        setError('Failed to load workflow diagram')
        setLoading(false)
      }
    }

    importDiagram()

    // Setup click handler
    if (onElementClick) {
      const eventBus = viewer.get('eventBus') as any

      const handleClick = (event: any) => {
        const { element } = event
        if (element && element.id && element.businessObject) {
          onElementClick(element.id, element)
        }
      }

      eventBus.on('element.click', handleClick)

      // Cleanup
      return () => {
        eventBus.off('element.click', handleClick)
        viewer.destroy()
      }
    }

    // Cleanup without click handler
    return () => {
      viewer.destroy()
    }
  }, [xml, onElementClick])

  // Zoom controls
  const zoomIn = () => {
    if (!viewerRef.current) return
    const canvas = viewerRef.current.get('canvas') as any
    const currentZoom = canvas.zoom()
    canvas.zoom(currentZoom * 1.2) // Zoom in by 20%
  }

  const zoomOut = () => {
    if (!viewerRef.current) return
    const canvas = viewerRef.current.get('canvas') as any
    const currentZoom = canvas.zoom()
    canvas.zoom(currentZoom * 0.8) // Zoom out by 20%
  }

  const zoomToFit = () => {
    if (!viewerRef.current) return
    const canvas = viewerRef.current.get('canvas') as any
    canvas.zoom('fit-viewport', 'auto')
  }

  return (
    <div className={`relative ${className}`}>
      {/* BPMN Canvas Container */}
      <div
        ref={containerRef}
        className="bpmn-container border rounded-md bg-white"
        style={{ height }}
      />

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading workflow...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      {!loading && !error && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            onClick={zoomIn}
            className="flex h-10 w-10 items-center justify-center rounded-md border bg-white shadow-sm hover:bg-gray-50 transition-colors"
            title="Zoom in"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v12m6-6H6"
              />
            </svg>
          </button>

          <button
            onClick={zoomOut}
            className="flex h-10 w-10 items-center justify-center rounded-md border bg-white shadow-sm hover:bg-gray-50 transition-colors"
            title="Zoom out"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 12H6"
              />
            </svg>
          </button>

          <button
            onClick={zoomToFit}
            className="flex h-10 w-10 items-center justify-center rounded-md border bg-white shadow-sm hover:bg-gray-50 transition-colors"
            title="Fit to viewport"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
