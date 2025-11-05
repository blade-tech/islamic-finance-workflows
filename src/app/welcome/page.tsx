'use client'

/**
 * WELCOME PAGE
 * ============
 * Standalone welcome/onboarding page accessible from navigation.
 * Shows the 5-stage workflow overview and collaboration features.
 */

import { useRouter } from 'next/navigation'
import WelcomeScreen from '@/components/workflow/WelcomeScreen'

export default function WelcomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/')
  }

  return <WelcomeScreen onGetStarted={handleGetStarted} />
}
