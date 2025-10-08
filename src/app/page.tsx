/**
 * HOME PAGE
 * =========
 * Main entry point for the Islamic Finance Workflows application.
 *
 * WHAT THIS DOES:
 * - Renders the WorkflowContainer
 * - Provides the 8-step workflow experience
 *
 * WHY SO SIMPLE:
 * - All complexity is in WorkflowContainer
 * - Clean separation of concerns
 * - Easy to understand and maintain
 */

import { WorkflowContainer } from '@/components/workflow/WorkflowContainer'

export default function HomePage() {
  return <WorkflowContainer />
}
