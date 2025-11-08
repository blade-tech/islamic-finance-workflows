/**
 * JURISDICTION-SPECIFIC CONTROL MAPPINGS
 * =======================================
 * Maps jurisdictions to their specific regulatory requirements,
 * prohibited structures, and control activations
 */

import { Jurisdiction } from './types'
import { Control } from './control-library'

// =============================================================================
// PROHIBITED STRUCTURES BY JURISDICTION
// =============================================================================

export interface ProhibitedStructure {
  structure: string
  reason: string
  authority: string
  reference: string
}

export const PROHIBITED_STRUCTURES: Record<Jurisdiction, ProhibitedStructure[]> = {
  'Malaysia': [
    {
      structure: 'Bay Al-Inah',
      reason: 'Sell-and-buyback structure prohibited by BNM SAC',
      authority: 'BNM Shariah Advisory Council',
      reference: 'BNM SAC Resolution (2009)'
    },
    {
      structure: 'Organized Tawarruq',
      reason: 'Commodity murabaha with organized arrangement prohibited',
      authority: 'BNM Shariah Advisory Council',
      reference: 'BNM SAC Guidelines on Tawarruq (2015)'
    }
  ],
  'Saudi Arabia': [
    {
      structure: 'Organized Tawarruq',
      reason: 'Commodity murabaha arrangements deemed not Shariah-compliant',
      authority: 'Islamic Fiqh Academy',
      reference: 'IFA Resolution No. 179 (19/5)'
    }
  ],
  'UAE': [],
  'Qatar': [],
  'Bahrain': [],
  'Other': []
}

// =============================================================================
// JURISDICTION-SPECIFIC REGULATORY REQUIREMENTS
// =============================================================================

export interface JurisdictionRequirements {
  jurisdiction: Jurisdiction
  regulatoryBody: string
  shariahAuthority: string
  shariahGovernance: string
  accountingFramework: string
  licensingRequirement: string
  specificControls: string[] // Control IDs that are mandatory for this jurisdiction
  additionalRequirements: string[]
}

export const JURISDICTION_REQUIREMENTS: Record<Jurisdiction, JurisdictionRequirements> = {
  'Malaysia': {
    jurisdiction: 'Malaysia',
    regulatoryBody: 'Bank Negara Malaysia (BNM)',
    shariahAuthority: 'BNM Shariah Advisory Council (SAC)',
    shariahGovernance: 'SAC rulings are binding (IFSA 2013). Institution must have SSB approved by BNM.',
    accountingFramework: 'MFRS (IFRS-aligned) + AAOIFI supplementary',
    licensingRequirement: 'BNM approval required under IFSA 2013',
    specificControls: ['RL-02', 'SG-01', 'SG-02', 'RL-01'],
    additionalRequirements: [
      'BNM SAC endorsement mandatory for all Islamic products',
      'Shariah Risk Management Framework required',
      'Zakat calculation and disclosure required',
      'PIDM (deposit insurance) participation if applicable'
    ]
  },
  'Saudi Arabia': {
    jurisdiction: 'Saudi Arabia',
    regulatoryBody: 'Saudi Central Bank (SAMA) / Capital Market Authority (CMA)',
    shariahAuthority: 'SAMA Shariah Board + Institution Shariah Supervisory Board',
    shariahGovernance: 'Dual oversight: SAMA central board + institution-level SSB required',
    accountingFramework: 'SOCPA accounting standards (local GAAP)',
    licensingRequirement: 'SAMA banking license / CMA approval for securities',
    specificControls: ['RL-02', 'SG-01', 'RL-01'],
    additionalRequirements: [
      'Real estate financing LTV limits: 85% residential, 70% commercial',
      'SAMA regulations on Islamic banking products',
      'CMA regulations for sukuk and Islamic securities',
      'Mandatory Zakat compliance'
    ]
  },
  'UAE': {
    jurisdiction: 'UAE',
    regulatoryBody: 'Central Bank of UAE (CBUAE) / DFSA (DIFC) / FSRA (ADGM)',
    shariahAuthority: 'Higher Sharia Authority (onshore) / Independent SSB (free zones)',
    shariahGovernance: 'Zone-specific: CBUAE (onshore), DFSA (DIFC), FSRA (ADGM). Each zone has different Shariah governance requirements.',
    accountingFramework: 'IFRS primary + AAOIFI FAS supplementary',
    licensingRequirement: 'Zone-dependent: CBUAE/DFSA/FSRA licensing required',
    specificControls: ['RL-02', 'RL-01'],
    additionalRequirements: [
      'Zone-specific regulatory compliance (onshore vs. DIFC vs. ADGM)',
      'Higher Sharia Authority guidance for onshore entities',
      'Independent SSB for DIFC/ADGM entities',
      'UAE Corporate Tax (9% from 2023) compliance'
    ]
  },
  'Qatar': {
    jurisdiction: 'Qatar',
    regulatoryBody: 'Qatar Central Bank (QCB)',
    shariahAuthority: 'QCB Centralized Shariah Board',
    shariahGovernance: 'Centralized Shariah Board model - QCB board rulings are binding',
    accountingFramework: 'AAOIFI FAS mandatory',
    licensingRequirement: 'QCB licensing required for Islamic financial institutions',
    specificControls: ['RL-02', 'SG-01', 'RL-01', 'AA-05'],
    additionalRequirements: [
      'AAOIFI accounting standards mandatory',
      'QCB Centralized Shariah Board oversight',
      'Mandatory AAOIFI Shariah audit (AA-05)',
      'Qatar Financial Markets Authority (QFMA) for listed securities'
    ]
  },
  'Bahrain': {
    jurisdiction: 'Bahrain',
    regulatoryBody: 'Central Bank of Bahrain (CBB)',
    shariahAuthority: 'CSSB (Centralized Shariah Supervisory Board)',
    shariahGovernance: 'Centralized model via CSSB. CSSB fatwas and standards binding on all institutions.',
    accountingFramework: 'AAOIFI FAS mandatory',
    licensingRequirement: 'CBB licensing required',
    specificControls: ['RL-02', 'SG-01', 'RL-01', 'AA-05'],
    additionalRequirements: [
      'AAOIFI accounting and Shariah standards mandatory',
      'CSSB (Centralized Shariah Supervisory Board) oversight',
      'Mandatory AAOIFI Shariah audit (AA-05)',
      'Listing on Bahrain Bourse if publicly offered'
    ]
  },
  'Other': {
    jurisdiction: 'Other',
    regulatoryBody: 'Jurisdiction-specific regulatory body',
    shariahAuthority: 'Local/International Shariah scholars',
    shariahGovernance: 'Institution-level Shariah Supervisory Board typically required',
    accountingFramework: 'IFRS or local GAAP + AAOIFI supplementary',
    licensingRequirement: 'Local regulatory approval required',
    specificControls: ['SG-01', 'RL-01'],
    additionalRequirements: [
      'Compliance with local securities regulations',
      'International standards (AAOIFI, IFSB) as guidance',
      'Institution-level Shariah governance'
    ]
  }
}

// =============================================================================
// JURISDICTION-SPECIFIC CONTROL FILTERS
// =============================================================================

/**
 * Get mandatory controls for a specific jurisdiction
 */
export function getMandatoryControlsForJurisdiction(jurisdiction: Jurisdiction): string[] {
  return JURISDICTION_REQUIREMENTS[jurisdiction]?.specificControls || []
}

/**
 * Check if a structure is prohibited in a jurisdiction
 */
export function isStructureProhibited(
  structure: string,
  jurisdiction: Jurisdiction
): ProhibitedStructure | undefined {
  return PROHIBITED_STRUCTURES[jurisdiction]?.find(
    p => p.structure.toLowerCase() === structure.toLowerCase()
  )
}

/**
 * Get all prohibited structures for a jurisdiction
 */
export function getProhibitedStructures(jurisdiction: Jurisdiction): ProhibitedStructure[] {
  return PROHIBITED_STRUCTURES[jurisdiction] || []
}

/**
 * Get regulatory requirements for a jurisdiction
 */
export function getJurisdictionRequirements(jurisdiction: Jurisdiction): JurisdictionRequirements {
  return JURISDICTION_REQUIREMENTS[jurisdiction] || JURISDICTION_REQUIREMENTS['Other']
}

/**
 * Check if AAOIFI accounting is mandatory for a jurisdiction
 */
export function isAAOIFIMandatory(jurisdiction: Jurisdiction): boolean {
  const req = JURISDICTION_REQUIREMENTS[jurisdiction]
  return req?.accountingFramework.includes('AAOIFI') &&
         req?.accountingFramework.includes('mandatory')
}

/**
 * Check if centralized Shariah board oversight applies
 */
export function hasCentralizedShariahBoard(jurisdiction: Jurisdiction): boolean {
  return ['Qatar', 'Bahrain'].includes(jurisdiction)
}

/**
 * Get licensing information for a jurisdiction
 */
export function getLicensingInfo(jurisdiction: Jurisdiction): {
  body: string
  requirement: string
  timeEstimate?: string
} {
  const req = JURISDICTION_REQUIREMENTS[jurisdiction]
  return {
    body: req?.regulatoryBody || 'Unknown',
    requirement: req?.licensingRequirement || 'Regulatory approval required',
    timeEstimate: getEstimatedLicensingTime(jurisdiction)
  }
}

function getEstimatedLicensingTime(jurisdiction: Jurisdiction): string {
  const estimates: Record<Jurisdiction, string> = {
    'Malaysia': '6-12 months',
    'Saudi Arabia': '4-8 months',
    'UAE': '3-6 months (zone-dependent)',
    'Qatar': '3-6 months',
    'Bahrain': '2-4 months',
    'Other': 'Varies by jurisdiction'
  }
  return estimates[jurisdiction] || 'Unknown'
}
