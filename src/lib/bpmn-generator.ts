/**
 * BPMN XML GENERATOR
 * ==================
 * Generates BPMN 2.0 XML for workflow visualization from 4-component configuration.
 *
 * PHASE 4A: Mock BPMN generation based on configuration
 * PHASE 4B: Will fetch real BPMN from Guardian MCP
 *
 * Generates:
 * - Main workflow with dynamic steps based on 4-component config
 * - Sub-workflows for ESG verification and audit processes
 */

import { WorkflowExecution } from './types'

/**
 * Generate main workflow BPMN XML
 * Based on SUKUK_LIFECYCLE_SOURCE_OF_TRUTH.md - QIIB Oryx Green Sukuk (Section 9.1)
 *
 * Realistic Sukuk Issuance Workflow:
 * - Phase 1: Origination & Structuring (Issuer, Legal Advisors)
 * - Phase 2: Shariah Compliance (Shariah Advisory Board)
 * - Phase 3: Independent Validation (SPO Provider)
 * - Phase 4: ESG Certification (for Green Sukuk)
 * - Phase 5: Regulatory Approval (Securities Commission)
 * - Phase 6: Investor Subscription & Issuance
 * - Phase 7: Asset Transfer & Settlement
 * - Phase 8: Deployment to Hedera Blockchain
 */
export function generateMockBPMN(execution: WorkflowExecution): string {
  const processId = 'main_workflow'
  const structureName = execution.selectedShariahStructure?.name || 'Sukuk'
  const processName = `${structureName} Issuance Workflow`

  const steps: string[] = []
  const flows: string[] = []
  let stepCounter = 0

  // ===== PHASE 1: ORIGINATION & STRUCTURING =====

  // Start Event
  steps.push(`    <startEvent id="start" name="Start Sukuk Issuance">
      <outgoing>flow_${stepCounter}</outgoing>
    </startEvent>`)

  // Step 1: Issuer Identifies Financing Need
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="start" targetRef="identify_need" />`)
  stepCounter++
  steps.push(`    <userTask id="identify_need" name="Identify Financing Need" camunda:assignee="Issuer">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </userTask>`)

  // Step 2: Structure Selection & Asset Identification
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="identify_need" targetRef="structure_design" />`)
  stepCounter++
  steps.push(`    <userTask id="structure_design" name="Structure Design & Asset Selection" camunda:assignee="Lead Arranger">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </userTask>`)

  // Step 3: Legal Documentation Preparation
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="structure_design" targetRef="legal_docs" />`)
  stepCounter++
  steps.push(`    <userTask id="legal_docs" name="Prepare Legal Documentation" camunda:assignee="Legal Advisor">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </userTask>`)

  // ===== PHASE 2: SHARIAH COMPLIANCE =====

  // Step 4: Shariah Advisory Board Review
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="legal_docs" targetRef="shariah_review" />`)
  stepCounter++
  steps.push(`    <userTask id="shariah_review" name="Shariah Board Reviews Structure" camunda:assignee="Shariah Advisory Board">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </userTask>`)

  // Gateway: Shariah Compliant?
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="shariah_review" targetRef="shariah_gateway" />`)
  stepCounter++
  steps.push(`    <exclusiveGateway id="shariah_gateway" name="Shariah Compliant?">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_shariah_approved</outgoing>
      <outgoing>flow_shariah_rejected</outgoing>
    </exclusiveGateway>`)

  // Revision path (if Shariah non-compliant)
  steps.push(`    <userTask id="revise_structure" name="Revise Structure for Shariah Compliance" camunda:assignee="Lead Arranger">
      <incoming>flow_shariah_rejected</incoming>
      <outgoing>flow_revision_back</outgoing>
    </userTask>`)
  flows.push(`    <sequenceFlow id="flow_shariah_rejected" name="Non-Compliant" sourceRef="shariah_gateway" targetRef="revise_structure" />`)
  flows.push(`    <sequenceFlow id="flow_revision_back" sourceRef="revise_structure" targetRef="shariah_review" />`)

  // Step 5: Issue Fatwa (Shariah Certificate)
  flows.push(`    <sequenceFlow id="flow_shariah_approved" name="Approved" sourceRef="shariah_gateway" targetRef="issue_fatwa" />`)
  steps.push(`    <serviceTask id="issue_fatwa" name="Issue Fatwa Certificate">
      <incoming>flow_shariah_approved</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </serviceTask>`)

  // ===== PHASE 3: INDEPENDENT VALIDATION (SPO) =====

  // Step 6: Second Party Opinion Review
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="issue_fatwa" targetRef="spo_review" />`)
  stepCounter++
  steps.push(`    <userTask id="spo_review" name="SPO Independent Shariah Validation" camunda:assignee="SPO Provider">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </userTask>`)

  // Step 7: SPO Report Issuance
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="spo_review" targetRef="spo_report" />`)
  stepCounter++
  steps.push(`    <serviceTask id="spo_report" name="Issue SPO Report">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </serviceTask>`)

  // ===== PHASE 4: GREEN/ESG CERTIFICATION (if Green Sukuk) =====

  let afterSPO = 'spo_report'
  if (execution.selectedImpacts && execution.selectedImpacts.length > 0) {
    // Step 8: Green SPO Review (Use of Proceeds Framework)
    flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="${afterSPO}" targetRef="green_spo_review" />`)
    stepCounter++
    steps.push(`    <userTask id="green_spo_review" name="Green SPO Reviews Framework" camunda:assignee="ESG Consultant">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </userTask>`)

    // Step 9: Green Certificate Issuance
    flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="green_spo_review" targetRef="green_certificate" />`)
    stepCounter++
    steps.push(`    <serviceTask id="green_certificate" name="Issue Green Bond Certificate">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </serviceTask>`)

    afterSPO = 'green_certificate'
  }

  // ===== PHASE 5: REGULATORY APPROVAL =====

  // Step 10: Regulatory Filing & Approval
  const regulatorName = execution.selectedJurisdiction?.name || 'Securities Commission'
  const regulatorRole = execution.selectedJurisdiction?.id === 'saudi_cma'
    ? 'CMA Officer'
    : execution.selectedJurisdiction?.id === 'malaysia_sc'
    ? 'SC Malaysia Officer'
    : 'Regulatory Officer'

  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="${afterSPO}" targetRef="regulatory_filing" />`)
  stepCounter++
  steps.push(`    <userTask id="regulatory_filing" name="${regulatorName} Reviews Prospectus" camunda:assignee="${regulatorRole}">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </userTask>`)

  // Step 11: Regulatory Approval Issuance
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="regulatory_filing" targetRef="regulatory_approval" />`)
  stepCounter++
  steps.push(`    <serviceTask id="regulatory_approval" name="Issue Regulatory Approval">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </serviceTask>`)

  // ===== PHASE 6: MARKETING & INVESTOR SUBSCRIPTION =====

  // Step 12: Investor Roadshow & Subscription
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="regulatory_approval" targetRef="roadshow" />`)
  stepCounter++
  steps.push(`    <userTask id="roadshow" name="Investor Roadshow & Order Book" camunda:assignee="Lead Arranger">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </userTask>`)

  // Step 13: Pricing & Allocation
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="roadshow" targetRef="pricing_allocation" />`)
  stepCounter++
  steps.push(`    <serviceTask id="pricing_allocation" name="Price Determination & Allocation">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </serviceTask>`)

  // ===== PHASE 7: CLOSING & SETTLEMENT =====

  // Step 14: SPV Incorporation & Asset Transfer
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="pricing_allocation" targetRef="spv_setup" />`)
  stepCounter++
  steps.push(`    <userTask id="spv_setup" name="SPV Setup & Asset Transfer" camunda:assignee="Trustee">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </userTask>`)

  // Step 15: Sukuk Certificate Issuance
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="spv_setup" targetRef="issue_certificates" />`)
  stepCounter++
  steps.push(`    <serviceTask id="issue_certificates" name="Issue Sukuk Certificates">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </serviceTask>`)

  // Step 16: Settlement & Listing
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="issue_certificates" targetRef="settlement" />`)
  stepCounter++
  steps.push(`    <serviceTask id="settlement" name="Settlement & Exchange Listing">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </serviceTask>`)

  // ===== PHASE 8: BLOCKCHAIN DEPLOYMENT =====

  // Step 17: Deploy to Hedera
  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="settlement" targetRef="deploy_hedera" />`)
  stepCounter++
  steps.push(`    <serviceTask id="deploy_hedera" name="Deploy Policy to Hedera">
      <incoming>flow_${stepCounter - 1}</incoming>
      <outgoing>flow_${stepCounter}</outgoing>
    </serviceTask>`)

  // End Event
  steps.push(`    <endEvent id="end" name="Sukuk Active on Hedera">
      <incoming>flow_${stepCounter}</incoming>
    </endEvent>`)

  flows.push(`    <sequenceFlow id="flow_${stepCounter}" sourceRef="deploy_hedera" targetRef="end" />`)

  return generateBPMNXML(processId, processName, steps.join('\n'), flows.join('\n'))
}

/**
 * Generate ESG Consultant sub-workflow BPMN
 * Per SUKUK_LIFECYCLE_SOURCE_OF_TRUTH.md lines 402-409, 1504-1508:
 * Green Sukuk stakeholder is "ESG Consultant" who validates environmental credentials
 */
export function generateESGSubWorkflow(execution: WorkflowExecution): string {
  const processId = 'esg_consultant_workflow'
  const processName = 'ESG Consultant Workflow'

  const steps: string[] = []
  const flows: string[] = []

  // Start
  steps.push(`    <startEvent id="start" name="Start ESG Review">
      <outgoing>flow_0</outgoing>
    </startEvent>`)

  // Collect ESG Data
  steps.push(`    <userTask id="collect_data" name="Collect ESG Data" camunda:assignee="ESG Consultant">
      <incoming>flow_0</incoming>
      <outgoing>flow_1</outgoing>
    </userTask>`)
  flows.push(`    <sequenceFlow id="flow_0" sourceRef="start" targetRef="collect_data" />`)

  // Parallel Gateway - Fork for each impact metric
  steps.push(`    <parallelGateway id="fork" name="Verify Each Metric">
      <incoming>flow_1</incoming>
      ${execution.selectedImpacts?.map((_, i) => `<outgoing>flow_fork_${i}</outgoing>`).join('\n      ')}
    </parallelGateway>`)
  flows.push(`    <sequenceFlow id="flow_1" sourceRef="collect_data" targetRef="fork" />`)

  // Add verification task for each metric
  execution.selectedImpacts?.forEach((impact, i) => {
    steps.push(`    <userTask id="verify_${impact.id}" name="Verify ${impact.name}" camunda:assignee="ESG Consultant">
      <incoming>flow_fork_${i}</incoming>
      <outgoing>flow_join_${i}</outgoing>
    </userTask>`)
    flows.push(`    <sequenceFlow id="flow_fork_${i}" sourceRef="fork" targetRef="verify_${impact.id}" />`)
  })

  // Parallel Gateway - Join
  steps.push(`    <parallelGateway id="join" name="">
      ${execution.selectedImpacts?.map((_, i) => `<incoming>flow_join_${i}</incoming>`).join('\n      ')}
      <outgoing>flow_2</outgoing>
    </parallelGateway>`)

  execution.selectedImpacts?.forEach((impact, i) => {
    flows.push(`    <sequenceFlow id="flow_join_${i}" sourceRef="verify_${impact.id}" targetRef="join" />`)
  })

  // Generate Report
  steps.push(`    <serviceTask id="generate_report" name="Generate ESG Report">
      <incoming>flow_2</incoming>
      <outgoing>flow_3</outgoing>
    </serviceTask>`)
  flows.push(`    <sequenceFlow id="flow_2" sourceRef="join" targetRef="generate_report" />`)

  // End
  steps.push(`    <endEvent id="end" name="ESG Verified">
      <incoming>flow_3</incoming>
    </endEvent>`)
  flows.push(`    <sequenceFlow id="flow_3" sourceRef="generate_report" targetRef="end" />`)

  return generateBPMNXML(processId, processName, steps.join('\n'), flows.join('\n'))
}

/**
 * Generate Audit Process sub-workflow BPMN
 */
export function generateAuditSubWorkflow(execution: WorkflowExecution): string {
  const processId = 'audit_workflow'
  const auditType = execution.selectedAccounting?.id === 'aaoifi' ? 'AAOIFI' : execution.selectedAccounting?.name || 'Financial'
  const processName = `${auditType} Audit Workflow`
  const auditorRole = execution.selectedAccounting?.id === 'aaoifi' ? 'AAOIFI Auditor' : 'External Auditor'

  const steps: string[] = []
  const flows: string[] = []

  // Start
  steps.push(`    <startEvent id="start" name="Start Audit">
      <outgoing>flow_0</outgoing>
    </startEvent>`)

  // Request Documents
  steps.push(`    <userTask id="request_docs" name="Request Financial Documents" camunda:assignee="Issuer">
      <incoming>flow_0</incoming>
      <outgoing>flow_1</outgoing>
    </userTask>`)
  flows.push(`    <sequenceFlow id="flow_0" sourceRef="start" targetRef="request_docs" />`)

  // Review Documents
  steps.push(`    <userTask id="review_docs" name="Review Documents" camunda:assignee="${auditorRole}">
      <incoming>flow_1</incoming>
      <outgoing>flow_2</outgoing>
    </userTask>`)
  flows.push(`    <sequenceFlow id="flow_1" sourceRef="request_docs" targetRef="review_docs" />`)

  // Conduct Field Work
  steps.push(`    <userTask id="field_work" name="Conduct Field Work" camunda:assignee="${auditorRole}">
      <incoming>flow_2</incoming>
      <outgoing>flow_3</outgoing>
    </userTask>`)
  flows.push(`    <sequenceFlow id="flow_2" sourceRef="review_docs" targetRef="field_work" />`)

  // Test Controls
  steps.push(`    <userTask id="test_controls" name="Test Internal Controls" camunda:assignee="${auditorRole}">
      <incoming>flow_3</incoming>
      <outgoing>flow_4</outgoing>
    </userTask>`)
  flows.push(`    <sequenceFlow id="flow_3" sourceRef="field_work" targetRef="test_controls" />`)

  // Gateway for findings
  steps.push(`    <exclusiveGateway id="findings_gateway" name="Issues Found?">
      <incoming>flow_4</incoming>
      <outgoing>flow_issues</outgoing>
      <outgoing>flow_clean</outgoing>
    </exclusiveGateway>`)
  flows.push(`    <sequenceFlow id="flow_4" sourceRef="test_controls" targetRef="findings_gateway" />`)

  // Address Findings (if issues)
  steps.push(`    <userTask id="address_findings" name="Address Findings" camunda:assignee="Issuer">
      <incoming>flow_issues</incoming>
      <outgoing>flow_retest</outgoing>
    </userTask>`)
  flows.push(`    <sequenceFlow id="flow_issues" name="Yes" sourceRef="findings_gateway" targetRef="address_findings" />`)
  flows.push(`    <sequenceFlow id="flow_retest" sourceRef="address_findings" targetRef="test_controls" />`)

  // Issue Opinion
  steps.push(`    <serviceTask id="issue_opinion" name="Issue Audit Opinion">
      <incoming>flow_clean</incoming>
      <outgoing>flow_5</outgoing>
    </serviceTask>`)
  flows.push(`    <sequenceFlow id="flow_clean" name="No" sourceRef="findings_gateway" targetRef="issue_opinion" />`)

  // End
  steps.push(`    <endEvent id="end" name="Audit Complete">
      <incoming>flow_5</incoming>
    </endEvent>`)
  flows.push(`    <sequenceFlow id="flow_5" sourceRef="issue_opinion" targetRef="end" />`)

  return generateBPMNXML(processId, processName, steps.join('\n'), flows.join('\n'))
}

/**
 * Helper to generate complete BPMN 2.0 XML with visual positioning
 */
function generateBPMNXML(processId: string, processName: string, stepsXML: string, flowsXML: string): string {
  // Generate BPMN DI (visual positioning) elements
  const diXML = generateBPMNDI(stepsXML, flowsXML)

  return `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
             id="definitions_${processId}"
             targetNamespace="http://bpmn.io/schema/bpmn"
             exporter="Islamic Finance Workflows"
             exporterVersion="1.0">
  <process id="${processId}" name="${processName}" isExecutable="true">
${stepsXML}
${flowsXML}
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
${diXML}
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`
}

/**
 * Generate BPMN DI (Diagram Interchange) visual positioning data
 * Creates BPMNShape and BPMNEdge elements with x/y coordinates
 */
function generateBPMNDI(stepsXML: string, flowsXML: string): string {
  const shapes: string[] = []
  const edges: string[] = []

  // Parse element IDs and types from stepsXML
  const elementPositions = new Map<string, { x: number; y: number; width: number; height: number }>()

  // Layout configuration
  const startX = 180
  const startY = 100
  const verticalSpacing = 120
  const horizontalSpacing = 200

  let currentY = startY
  let currentX = startX

  // Extract elements with their types
  const startEventMatch = stepsXML.match(/<startEvent id="([^"]+)"/g)
  const userTaskMatches = stepsXML.match(/<userTask id="([^"]+)"/g)
  const serviceTaskMatches = stepsXML.match(/<serviceTask id="([^"]+)"/g)
  const gatewayMatches = stepsXML.match(/<exclusiveGateway id="([^"]+)"/g)
  const parallelGatewayMatches = stepsXML.match(/<parallelGateway id="([^"]+)"/g)
  const endEventMatch = stepsXML.match(/<endEvent id="([^"]+)"/g)

  // Process start event
  if (startEventMatch) {
    const id = startEventMatch[0].match(/id="([^"]+)"/)?.[1]
    if (id) {
      elementPositions.set(id, { x: currentX, y: currentY, width: 36, height: 36 })
      shapes.push(`      <bpmndi:BPMNShape id="shape_${id}" bpmnElement="${id}">
        <dc:Bounds x="${currentX}" y="${currentY}" width="36" height="36"/>
      </bpmndi:BPMNShape>`)
      currentY += verticalSpacing
    }
  }

  // Process all tasks and gateways in order they appear
  const allElements = stepsXML.split('\n')
  for (const line of allElements) {
    // User tasks
    const userTaskMatch = line.match(/<userTask id="([^"]+)"/)
    if (userTaskMatch) {
      const id = userTaskMatch[1]

      // Special positioning for revision task (to the right of main flow)
      if (id === 'revise_structure') {
        const gatewayPos = elementPositions.get('shariah_gateway')
        if (gatewayPos) {
          elementPositions.set(id, { x: gatewayPos.x + horizontalSpacing, y: gatewayPos.y, width: 100, height: 80 })
          shapes.push(`      <bpmndi:BPMNShape id="shape_${id}" bpmnElement="${id}">
        <dc:Bounds x="${gatewayPos.x + horizontalSpacing}" y="${gatewayPos.y - 15}" width="100" height="80"/>
      </bpmndi:BPMNShape>`)
        }
        continue
      }

      elementPositions.set(id, { x: currentX, y: currentY, width: 100, height: 80 })
      shapes.push(`      <bpmndi:BPMNShape id="shape_${id}" bpmnElement="${id}">
        <dc:Bounds x="${currentX}" y="${currentY}" width="100" height="80"/>
      </bpmndi:BPMNShape>`)
      currentY += verticalSpacing
      continue
    }

    // Service tasks
    const serviceTaskMatch = line.match(/<serviceTask id="([^"]+)"/)
    if (serviceTaskMatch) {
      const id = serviceTaskMatch[1]
      elementPositions.set(id, { x: currentX, y: currentY, width: 100, height: 80 })
      shapes.push(`      <bpmndi:BPMNShape id="shape_${id}" bpmnElement="${id}">
        <dc:Bounds x="${currentX}" y="${currentY}" width="100" height="80"/>
      </bpmndi:BPMNShape>`)
      currentY += verticalSpacing
      continue
    }

    // Exclusive gateways
    const gatewayMatch = line.match(/<exclusiveGateway id="([^"]+)"/)
    if (gatewayMatch) {
      const id = gatewayMatch[1]
      elementPositions.set(id, { x: currentX + 25, y: currentY, width: 50, height: 50 })
      shapes.push(`      <bpmndi:BPMNShape id="shape_${id}" bpmnElement="${id}" isMarkerVisible="true">
        <dc:Bounds x="${currentX + 25}" y="${currentY}" width="50" height="50"/>
      </bpmndi:BPMNShape>`)
      currentY += verticalSpacing
      continue
    }

    // Parallel gateways
    const parallelGatewayMatch = line.match(/<parallelGateway id="([^"]+)"/)
    if (parallelGatewayMatch) {
      const id = parallelGatewayMatch[1]
      elementPositions.set(id, { x: currentX + 25, y: currentY, width: 50, height: 50 })
      shapes.push(`      <bpmndi:BPMNShape id="shape_${id}" bpmnElement="${id}">
        <dc:Bounds x="${currentX + 25}" y="${currentY}" width="50" height="50"/>
      </bpmndi:BPMNShape>`)
      currentY += verticalSpacing
      continue
    }
  }

  // Process end event
  if (endEventMatch) {
    const id = endEventMatch[0].match(/id="([^"]+)"/)?.[1]
    if (id) {
      elementPositions.set(id, { x: currentX, y: currentY, width: 36, height: 36 })
      shapes.push(`      <bpmndi:BPMNShape id="shape_${id}" bpmnElement="${id}">
        <dc:Bounds x="${currentX}" y="${currentY}" width="36" height="36"/>
      </bpmndi:BPMNShape>`)
    }
  }

  // Generate edges (sequence flows) with waypoints
  const flowMatches = flowsXML.matchAll(/<sequenceFlow id="([^"]+)" (?:name="[^"]*" )?sourceRef="([^"]+)" targetRef="([^"]+)"/g)
  for (const match of flowMatches) {
    const [, flowId, sourceRef, targetRef] = match
    const sourcePos = elementPositions.get(sourceRef)
    const targetPos = elementPositions.get(targetRef)

    if (sourcePos && targetPos) {
      // Calculate waypoints (source center to target center)
      const sourceX = sourcePos.x + sourcePos.width / 2
      const sourceY = sourcePos.y + sourcePos.height / 2
      const targetX = targetPos.x + targetPos.width / 2
      const targetY = targetPos.y + targetPos.height / 2

      edges.push(`      <bpmndi:BPMNEdge id="edge_${flowId}" bpmnElement="${flowId}">
        <di:waypoint x="${sourceX}" y="${sourceY}"/>
        <di:waypoint x="${targetX}" y="${targetY}"/>
      </bpmndi:BPMNEdge>`)
    }
  }

  return shapes.join('\n') + '\n' + edges.join('\n')
}
