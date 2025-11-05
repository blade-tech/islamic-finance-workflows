'use client'

/**
 * TRUSTCHAIN VISUALIZATION
 * ========================
 * Interactive D3.js force-directed graph showing VP → VCs hierarchy.
 *
 * WHAT THIS SHOWS:
 * - Central VP (Verifiable Presentation) node
 * - 4 VC (Verifiable Credential) nodes connected to VP
 * - Color-coded by component type
 * - Interactive hover tooltips
 * - Click to expand credential details
 *
 * DESIGN:
 * - VP node: Large, purple glow, center of graph
 * - VC nodes: Medium, color-coded, surrounding VP
 * - Links: Animated connections with arrows
 * - Responsive: Adjusts to container width
 */

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Info } from 'lucide-react'

interface Node {
  id: string
  type: 'vp' | 'vc'
  label: string
  componentType?: 'shariah' | 'jurisdiction' | 'accounting' | 'impact'
  cid?: string
  issuer?: string
  issuanceDate?: string
  complianceScore?: number
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface Link {
  source: string | Node
  target: string | Node
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

interface TrustChainVisualizationProps {
  vp: any // Verifiable Presentation data
}

export function TrustChainVisualization({ vp }: TrustChainVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [graphData, setGraphData] = useState<GraphData | null>(null)

  // Color mapping for component types
  const componentColors: Record<string, string> = {
    vp: '#8B5CF6', // Purple for VP
    shariah: '#8B5CF6', // Purple
    jurisdiction: '#F97316', // Orange
    accounting: '#3B82F6', // Blue
    impact: '#10B981' // Green
  }

  useEffect(() => {
    if (!vp || !vp.verifiableCredential) return

    // Prepare graph data from VP
    const nodes: Node[] = [
      {
        id: 'vp',
        type: 'vp',
        label: 'Verifiable Presentation',
        cid: vp.proof?.ipfsCid
      }
    ]

    const links: Link[] = []

    // Add VC nodes
    vp.verifiableCredential.forEach((vc: any, index: number) => {
      const componentType = vc.credentialSubject?.componentType || 'shariah'
      const vcNode: Node = {
        id: `vc-${index}`,
        type: 'vc',
        label: vc.credentialSubject?.componentName || `Credential ${index + 1}`,
        componentType: componentType as any,
        cid: vc.proof?.ipfsCid,
        issuer: vc.issuer,
        issuanceDate: vc.issuanceDate,
        complianceScore: vc.credentialSubject?.complianceScore
      }
      nodes.push(vcNode)
      links.push({ source: 'vp', target: `vc-${index}` })
    })

    setGraphData({ nodes, links })
  }, [vp])

  useEffect(() => {
    if (!graphData || !svgRef.current) return

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove()

    const width = 800
    const height = 600
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)

    // Create force simulation
    const simulation = d3
      .forceSimulation(graphData.nodes as any)
      .force(
        'link',
        d3
          .forceLink(graphData.links)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))

    // Create arrow markers for links
    svg
      .append('defs')
      .selectAll('marker')
      .data(['arrow'])
      .enter()
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 35)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#94a3b8')

    // Create link lines
    const link = svg
      .append('g')
      .selectAll('line')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', 'url(#arrow)')

    // Create node groups
    const node = svg
      .append('g')
      .selectAll('g')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(
        d3
          .drag<any, Node>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )
      .on('click', (event, d) => {
        setSelectedNode(d)
      })

    // Add glow filter for VP node
    const defs = svg.append('defs')
    const filter = defs.append('filter').attr('id', 'glow')
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '3.5')
      .attr('result', 'coloredBlur')
    const feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Add circles for nodes
    node
      .append('circle')
      .attr('r', (d) => (d.type === 'vp' ? 40 : 30))
      .attr('fill', (d) => {
        if (d.type === 'vp') return componentColors.vp
        return componentColors[d.componentType || 'shariah']
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('filter', (d) => (d.type === 'vp' ? 'url(#glow)' : 'none'))
      .on('mouseover', function () {
        d3.select(this).transition().duration(200).attr('r', (d: any) => (d.type === 'vp' ? 45 : 35))
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('r', (d: any) => (d.type === 'vp' ? 40 : 30))
      })

    // Add icons to nodes (using text symbols)
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#fff')
      .attr('font-size', (d) => (d.type === 'vp' ? '24px' : '18px'))
      .attr('pointer-events', 'none')
      .text((d) => (d.type === 'vp' ? '🏆' : '✓'))

    // Add labels below nodes
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', (d) => (d.type === 'vp' ? 55 : 45))
      .attr('font-size', '12px')
      .attr('font-weight', (d) => (d.type === 'vp' ? 'bold' : 'normal'))
      .attr('fill', '#1f2937')
      .attr('class', 'dark:fill-gray-300')
      .text((d) => d.label)
      .call(wrap, 120)

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Text wrapping function
    function wrap(text: any, width: number) {
      text.each(function (this: any) {
        const text = d3.select(this)
        const words = text.text().split(/\s+/).reverse()
        let word
        let line: string[] = []
        let lineNumber = 0
        const lineHeight = 1.1
        const y = text.attr('y')
        const dy = 0
        let tspan = text
          .text(null)
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', dy + 'em')

        while ((word = words.pop())) {
          line.push(word)
          tspan.text(line.join(' '))
          if ((tspan.node() as any).getComputedTextLength() > width) {
            line.pop()
            tspan.text(line.join(' '))
            line = [word]
            tspan = text
              .append('tspan')
              .attr('x', 0)
              .attr('y', y)
              .attr('dy', ++lineNumber * lineHeight + dy + 'em')
              .text(word)
          }
        }
      })
    }

    return () => {
      simulation.stop()
    }
  }, [graphData])

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge
          variant="outline"
          className="bg-purple-50 dark:bg-purple-950/30 border-purple-200"
        >
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: componentColors.vp }}
          />
          Verifiable Presentation
        </Badge>
        <Badge
          variant="outline"
          className="bg-purple-50 dark:bg-purple-950/30 border-purple-200"
        >
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: componentColors.shariah }}
          />
          Shariah
        </Badge>
        <Badge
          variant="outline"
          className="bg-orange-50 dark:bg-orange-950/30 border-orange-200"
        >
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: componentColors.jurisdiction }}
          />
          Jurisdiction
        </Badge>
        <Badge
          variant="outline"
          className="bg-blue-50 dark:bg-blue-950/30 border-blue-200"
        >
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: componentColors.accounting }}
          />
          Accounting
        </Badge>
        <Badge
          variant="outline"
          className="bg-green-50 dark:bg-green-950/30 border-green-200"
        >
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: componentColors.impact }}
          />
          Impact
        </Badge>
      </div>

      {/* Graph Container */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* SVG Graph */}
        <div className="flex-1 border rounded-lg p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
          <svg ref={svgRef} className="w-full h-auto" />
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <Card className="lg:w-80">
            <CardContent className="p-4 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        selectedNode.type === 'vp'
                          ? componentColors.vp
                          : componentColors[selectedNode.componentType || 'shariah']
                    }}
                  />
                  <h3 className="font-semibold text-sm">
                    {selectedNode.type === 'vp' ? 'Verifiable Presentation' : 'Verifiable Credential'}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">{selectedNode.label}</p>
              </div>

              {selectedNode.type === 'vc' && (
                <>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Component Type</p>
                      <p className="text-sm font-medium capitalize">{selectedNode.componentType}</p>
                    </div>
                    {selectedNode.complianceScore !== undefined && (
                      <div>
                        <p className="text-xs text-muted-foreground">Compliance Score</p>
                        <p className="text-sm font-medium">{selectedNode.complianceScore}%</p>
                      </div>
                    )}
                    {selectedNode.issuanceDate && (
                      <div>
                        <p className="text-xs text-muted-foreground">Issuance Date</p>
                        <p className="text-sm font-medium">
                          {new Date(selectedNode.issuanceDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedNode.cid && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">IPFS CID</p>
                  <p className="text-xs font-mono break-all bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {selectedNode.cid}
                  </p>
                  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                    <a
                      href={`https://ipfs.io/ipfs/${selectedNode.cid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3 mr-2" />
                      View on IPFS
                    </a>
                  </Button>
                </div>
              )}

              <div className="pt-3 border-t">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <p>
                    {selectedNode.type === 'vp'
                      ? 'The VP bundles all component credentials into a single verifiable package.'
                      : 'This credential verifies compliance for a specific component.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        <p>💡 Drag nodes to rearrange • Click nodes to view details • Hover for interactions</p>
      </div>
    </div>
  )
}
