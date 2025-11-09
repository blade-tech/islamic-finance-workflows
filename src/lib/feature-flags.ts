/**
 * FEATURE FLAGS
 * =============
 * Environment-based feature toggles for gradual rollout
 */

export const featureFlags = {
  // Qatar Ijārah Off-Plan Demo
  qatarIjarahDemo: process.env.NEXT_PUBLIC_ENABLE_IJARAH_DEMO === 'true',

  // Future jurisdiction demos
  uaeDemo: false,
  saudiDemo: false,
  malaysiaDemo: false,

  // Experimental features
  workflowDesigner: false,
  aiCopilot: false,
} as const

export type FeatureFlag = keyof typeof featureFlags
