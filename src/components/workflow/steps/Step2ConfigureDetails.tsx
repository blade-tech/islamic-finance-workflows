'use client'

/**
 * STEP 2: CONFIGURE DETAILS
 * ==========================
 * Configure workflow details with AI assistance.
 *
 * WHAT THIS STEP DOES:
 * - Dynamic form generation from Guardian policy schemas (hardcoded for Phase 4A)
 * - AI auto-fill suggestions for field values
 * - Real-time validation against AAOIFI/IIFM standards
 * - Role assignment for workflow participants
 * - Document upload with AI extraction (placeholder for Phase 4A)
 *
 * USER-FACING TERMINOLOGY:
 * - "Workflow" (not "policy")
 * - "Template" (not "methodology")
 * - "Configure" (not "setup policy")
 * - Standards mentioned by name (AAOIFI, IIFM)
 *
 * PHASE 4A SCOPE:
 * - Hardcoded Sukuk form fields (will be dynamic in 4B)
 * - Mock AI suggestions (will be real Claude in 4B)
 * - Basic validation (will use Guardian schemas in 4B)
 */

import { useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Info,
  Sparkles,
  CheckCircle2,
  Upload,
  FileText,
  Users,
  AlertCircle,
} from 'lucide-react'

// FORM CONFIGURATIONS BY METHODOLOGY TYPE
// Based on SUKUK_LIFECYCLE_SOURCE_OF_TRUTH.md research for Sukuk structures
// Semi-realistic inferred forms for other methodologies (Phase 4A)

interface FormField {
  id: string
  label: string
  type: 'text' | 'number' | 'select' | 'date'
  placeholder?: string
  options?: string[]
  aiSuggestion: string
  required: boolean
  defaultValue?: string
}

interface FormConfig {
  name: string
  description: string
  basicInfo: FormField[]
  roles: FormField[]
  complianceStandards: string[]
}

const FORM_CONFIGS: Record<string, FormConfig> = {
  // ==================== SUKUK STRUCTURES (6 types) ====================

  // 1. IJARA SUKUK (60% market share - Real estate & infrastructure)
  sukuk_ijara: {
    name: 'Ijara Sukuk Issuance',
    description: 'Lease-based Sukuk for real estate and infrastructure projects (60% of global Sukuk market)',
    basicInfo: [
      {
        id: 'issuer_name',
        label: 'Issuer Name',
        type: 'text',
        placeholder: 'e.g., Qatar International Islamic Bank',
        aiSuggestion: 'Qatar International Islamic Bank',
        required: true,
      },
      {
        id: 'asset_type',
        label: 'Underlying Asset Type',
        type: 'select',
        options: ['Real Estate', 'Infrastructure', 'Equipment', 'Aircraft', 'Green Energy Facilities'],
        aiSuggestion: 'For Ijara: Real Estate or Infrastructure most common',
        required: true,
      },
      {
        id: 'issue_amount',
        label: 'Total Issue Amount (USD)',
        type: 'number',
        placeholder: '500000000',
        aiSuggestion: 'Typical range: $100M - $500M (e.g., QIIB Orix: $500M)',
        required: true,
      },
      {
        id: 'lease_period_years',
        label: 'Lease Period (Years)',
        type: 'number',
        placeholder: '5',
        aiSuggestion: 'Standard tenures: 3, 5, 7, or 10 years (QIIB Orix: 5 years)',
        required: true,
      },
      {
        id: 'expected_return',
        label: 'Expected Return (% per annum)',
        type: 'number',
        placeholder: '5.25',
        aiSuggestion: 'Market range: 5-6% (e.g., QIIB Orix: 5.25%)',
        required: true,
      },
      {
        id: 'asset_description',
        label: 'Asset Description',
        type: 'text',
        placeholder: 'e.g., Solar energy farms and wind turbine facilities',
        aiSuggestion: 'Describe tangible assets backing the Sukuk',
        required: true,
      },
    ],
    roles: [
      {
        id: 'shariah_board',
        label: 'Shariah Advisory Board',
        type: 'select',
        aiSuggestion: 'AAOIFI requires 3-5 qualified Shariah scholars',
        required: true,
      },
      {
        id: 'spo_provider',
        label: 'Second Party Opinion (SPO) Provider',
        type: 'select',
        aiSuggestion: 'Independent Shariah certification body',
        required: true,
      },
      {
        id: 'trustee',
        label: 'Trustee',
        type: 'select',
        aiSuggestion: 'Independent trustee to protect Sukuk holders',
        required: true,
      },
      {
        id: 'lead_arranger',
        label: 'Lead Arranger/Underwriter',
        type: 'select',
        aiSuggestion: 'Investment bank arranging the issuance',
        required: true,
      },
      {
        id: 'paying_agent',
        label: 'Paying Agent',
        type: 'select',
        aiSuggestion: 'Handles distribution payments to investors',
        required: true,
      },
      {
        id: 'issuer',
        label: 'Issuer',
        type: 'text',
        defaultValue: 'You',
        aiSuggestion: 'Current user',
        required: true,
      },
    ],
    complianceStandards: [
      'AAOIFI Shariah Standard 62 (Sukuk)',
      'AAOIFI FAS 33 - Investment Sukuk',
      'IIFM Sukuk Standards',
      'AAOIFI Governance Standard (if applicable)',
    ],
  },

  // 2. MURABAHA SUKUK (Working capital financing)
  sukuk_murabaha: {
    name: 'Murabaha Sukuk Issuance',
    description: 'Cost-plus financing for working capital and trade finance',
    basicInfo: [
      {
        id: 'issuer_name',
        label: 'Issuer Name',
        type: 'text',
        placeholder: 'e.g., ABC Islamic Bank',
        aiSuggestion: 'ABC Islamic Bank',
        required: true,
      },
      {
        id: 'commodity_type',
        label: 'Underlying Commodity',
        type: 'select',
        options: ['Metals', 'Crude Oil', 'Refined Petroleum', 'Agricultural Products', 'General Goods'],
        aiSuggestion: 'Murabaha requires tangible commodity trading',
        required: true,
      },
      {
        id: 'cost_price',
        label: 'Cost Price (USD)',
        type: 'number',
        placeholder: '100000000',
        aiSuggestion: 'Original purchase cost before markup',
        required: true,
      },
      {
        id: 'profit_margin',
        label: 'Profit Margin (%)',
        type: 'number',
        placeholder: '2.5',
        aiSuggestion: 'Typical markup: 2-4% for working capital',
        required: true,
      },
      {
        id: 'tenor_months',
        label: 'Financing Tenor (Months)',
        type: 'number',
        placeholder: '12',
        aiSuggestion: 'Short to medium term: 6-24 months typical',
        required: true,
      },
    ],
    roles: [
      {
        id: 'shariah_board',
        label: 'Shariah Advisory Board',
        type: 'select',
        aiSuggestion: '3-5 qualified Shariah scholars required',
        required: true,
      },
      {
        id: 'commodity_broker',
        label: 'Commodity Broker',
        type: 'select',
        aiSuggestion: 'LME or similar platform for commodity exchange',
        required: true,
      },
      {
        id: 'trustee',
        label: 'Trustee',
        type: 'select',
        aiSuggestion: 'Independent trustee',
        required: true,
      },
      {
        id: 'issuer',
        label: 'Issuer',
        type: 'text',
        defaultValue: 'You',
        aiSuggestion: 'Current user',
        required: true,
      },
    ],
    complianceStandards: [
      'AAOIFI Shariah Standard 8 (Murabaha)',
      'AAOIFI Shariah Standard 62 (Sukuk)',
      'IIFM Murabaha Standards',
    ],
  },

  // 3. MUSHARAKA SUKUK (Project finance - equity partnership)
  sukuk_musharaka: {
    name: 'Musharaka Sukuk Issuance',
    description: 'Partnership-based Sukuk for project finance and equity participation',
    basicInfo: [
      {
        id: 'issuer_name',
        label: 'Issuer Name',
        type: 'text',
        placeholder: 'e.g., Gulf Infrastructure Fund',
        aiSuggestion: 'Gulf Infrastructure Fund',
        required: true,
      },
      {
        id: 'project_name',
        label: 'Project Name',
        type: 'text',
        placeholder: 'e.g., Dubai Metro Extension Project',
        aiSuggestion: 'Infrastructure or real estate development project',
        required: true,
      },
      {
        id: 'total_capital',
        label: 'Total Partnership Capital (USD)',
        type: 'number',
        placeholder: '300000000',
        aiSuggestion: 'Combined capital from all partners',
        required: true,
      },
      {
        id: 'issuer_capital_ratio',
        label: 'Issuer Capital Contribution (%)',
        type: 'number',
        placeholder: '30',
        aiSuggestion: 'Typical split: 20-40% issuer, rest from Sukuk holders',
        required: true,
      },
      {
        id: 'profit_share_ratio',
        label: 'Profit Sharing Ratio to Sukuk Holders (%)',
        type: 'number',
        placeholder: '70',
        aiSuggestion: 'Must match capital ratio or be negotiated separately',
        required: true,
      },
      {
        id: 'project_duration_years',
        label: 'Project Duration (Years)',
        type: 'number',
        placeholder: '7',
        aiSuggestion: 'Medium to long term: 5-10 years typical',
        required: true,
      },
    ],
    roles: [
      {
        id: 'shariah_board',
        label: 'Shariah Advisory Board',
        type: 'select',
        aiSuggestion: '3-5 scholars required for partnership validation',
        required: true,
      },
      {
        id: 'managing_partner',
        label: 'Managing Partner',
        type: 'select',
        aiSuggestion: 'Entity responsible for project management',
        required: true,
      },
      {
        id: 'trustee',
        label: 'Trustee',
        type: 'select',
        aiSuggestion: 'Independent trustee',
        required: true,
      },
      {
        id: 'issuer',
        label: 'Issuer',
        type: 'text',
        defaultValue: 'You',
        aiSuggestion: 'Current user',
        required: true,
      },
    ],
    complianceStandards: [
      'AAOIFI Shariah Standard 12 (Musharaka)',
      'AAOIFI Shariah Standard 62 (Sukuk)',
      'IIFM Musharaka Standards',
    ],
  },

  // 4. MUDARABA SUKUK (Fund management - profit-sharing)
  sukuk_mudaraba: {
    name: 'Mudaraba Sukuk Issuance',
    description: 'Profit-sharing Sukuk for fund management and investment activities',
    basicInfo: [
      {
        id: 'issuer_name',
        label: 'Fund Manager (Mudarib)',
        type: 'text',
        placeholder: 'e.g., Al Baraka Investment Management',
        aiSuggestion: 'Al Baraka Investment Management',
        required: true,
      },
      {
        id: 'fund_purpose',
        label: 'Fund Investment Purpose',
        type: 'select',
        options: ['Real Estate Development', 'SME Financing', 'Trade Finance', 'Infrastructure', 'Mixed Portfolio'],
        aiSuggestion: 'Mudaraba commonly used for real estate and SME funds',
        required: true,
      },
      {
        id: 'capital_amount',
        label: 'Total Fund Capital (USD)',
        type: 'number',
        placeholder: '200000000',
        aiSuggestion: 'Rab al-Mal (investors) capital only',
        required: true,
      },
      {
        id: 'mudarib_profit_share',
        label: 'Mudarib Profit Share (%)',
        type: 'number',
        placeholder: '20',
        aiSuggestion: 'Fund manager typically takes 15-25% of profits',
        required: true,
      },
      {
        id: 'investor_profit_share',
        label: 'Investor (Rab al-Mal) Profit Share (%)',
        type: 'number',
        placeholder: '80',
        aiSuggestion: 'Must total 100% with Mudarib share',
        required: true,
      },
      {
        id: 'fund_duration_years',
        label: 'Fund Duration (Years)',
        type: 'number',
        placeholder: '5',
        aiSuggestion: 'Typical: 3-7 years for closed-end funds',
        required: true,
      },
    ],
    roles: [
      {
        id: 'shariah_board',
        label: 'Shariah Advisory Board',
        type: 'select',
        aiSuggestion: 'Required for ongoing investment screening',
        required: true,
      },
      {
        id: 'mudarib',
        label: 'Mudarib (Fund Manager)',
        type: 'text',
        defaultValue: 'You',
        aiSuggestion: 'Manager with expertise, no capital contribution',
        required: true,
      },
      {
        id: 'trustee',
        label: 'Trustee',
        type: 'select',
        aiSuggestion: 'Independent trustee representing investors',
        required: true,
      },
      {
        id: 'custodian',
        label: 'Custodian',
        type: 'select',
        aiSuggestion: 'Holds fund assets securely',
        required: true,
      },
    ],
    complianceStandards: [
      'AAOIFI Shariah Standard 13 (Mudaraba)',
      'AAOIFI Shariah Standard 62 (Sukuk)',
      'IIFM Mudaraba Standards',
    ],
  },

  // 5. ISTISNA SUKUK (Construction and manufacturing)
  sukuk_istisna: {
    name: 'Istisna Sukuk Issuance',
    description: 'Construction-based Sukuk for build-to-order projects and manufacturing',
    basicInfo: [
      {
        id: 'issuer_name',
        label: 'Issuer Name',
        type: 'text',
        placeholder: 'e.g., Emirates Construction Finance',
        aiSuggestion: 'Emirates Construction Finance',
        required: true,
      },
      {
        id: 'project_description',
        label: 'Construction Project',
        type: 'text',
        placeholder: 'e.g., 500-unit residential complex in Dubai',
        aiSuggestion: 'Describe the construction deliverable',
        required: true,
      },
      {
        id: 'total_contract_value',
        label: 'Total Contract Value (USD)',
        type: 'number',
        placeholder: '150000000',
        aiSuggestion: 'Full cost to build according to specifications',
        required: true,
      },
      {
        id: 'construction_period_months',
        label: 'Construction Period (Months)',
        type: 'number',
        placeholder: '24',
        aiSuggestion: 'Build duration: 18-36 months typical for major projects',
        required: true,
      },
      {
        id: 'payment_schedule',
        label: 'Payment Schedule',
        type: 'select',
        options: ['Progressive (milestone-based)', 'Deferred (upon completion)', 'Hybrid'],
        aiSuggestion: 'Progressive payments at milestones most common',
        required: true,
      },
      {
        id: 'completion_date',
        label: 'Expected Completion Date',
        type: 'date',
        aiSuggestion: 'Shariah requires definite completion date',
        required: true,
      },
    ],
    roles: [
      {
        id: 'shariah_board',
        label: 'Shariah Advisory Board',
        type: 'select',
        aiSuggestion: 'Validates project specifications and progress',
        required: true,
      },
      {
        id: 'contractor',
        label: 'Main Contractor (Manufacturer)',
        type: 'select',
        aiSuggestion: 'Entity executing the construction',
        required: true,
      },
      {
        id: 'project_engineer',
        label: 'Independent Project Engineer',
        type: 'select',
        aiSuggestion: 'Certifies milestone completion',
        required: true,
      },
      {
        id: 'trustee',
        label: 'Trustee',
        type: 'select',
        aiSuggestion: 'Independent trustee',
        required: true,
      },
      {
        id: 'issuer',
        label: 'Issuer',
        type: 'text',
        defaultValue: 'You',
        aiSuggestion: 'Current user',
        required: true,
      },
    ],
    complianceStandards: [
      'AAOIFI Shariah Standard 11 (Istisna)',
      'AAOIFI Shariah Standard 62 (Sukuk)',
      'IIFM Istisna Standards',
    ],
  },

  // 6. SALAM SUKUK (Agricultural and commodity forward contracts)
  sukuk_salam: {
    name: 'Salam Sukuk Issuance',
    description: 'Forward purchase Sukuk for agricultural commodities and standardized goods',
    basicInfo: [
      {
        id: 'issuer_name',
        label: 'Issuer Name',
        type: 'text',
        placeholder: 'e.g., Gulf Agricultural Finance Corp',
        aiSuggestion: 'Gulf Agricultural Finance Corp',
        required: true,
      },
      {
        id: 'commodity_type',
        label: 'Commodity Type',
        type: 'select',
        options: ['Wheat', 'Rice', 'Dates', 'Cotton', 'Crude Oil', 'Gold', 'Other Fungible Goods'],
        aiSuggestion: 'Must be fungible (interchangeable) commodity',
        required: true,
      },
      {
        id: 'commodity_quantity',
        label: 'Commodity Quantity',
        type: 'text',
        placeholder: 'e.g., 50,000 metric tons',
        aiSuggestion: 'Specify quantity and unit (tons, barrels, ounces)',
        required: true,
      },
      {
        id: 'advance_payment',
        label: 'Advance Payment (USD)',
        type: 'number',
        placeholder: '100000000',
        aiSuggestion: 'Full payment in advance (Salam requirement)',
        required: true,
      },
      {
        id: 'delivery_date',
        label: 'Delivery Date',
        type: 'date',
        aiSuggestion: 'Future delivery date (typically 6-12 months)',
        required: true,
      },
      {
        id: 'delivery_location',
        label: 'Delivery Location',
        type: 'text',
        placeholder: 'e.g., Jeddah Islamic Port, Saudi Arabia',
        aiSuggestion: 'Specific location required for Shariah validity',
        required: true,
      },
    ],
    roles: [
      {
        id: 'shariah_board',
        label: 'Shariah Advisory Board',
        type: 'select',
        aiSuggestion: 'Validates commodity specification and contract',
        required: true,
      },
      {
        id: 'commodity_broker',
        label: 'Commodity Broker/Exchange',
        type: 'select',
        aiSuggestion: 'Facilitates commodity trading and delivery',
        required: true,
      },
      {
        id: 'quality_inspector',
        label: 'Independent Quality Inspector',
        type: 'select',
        aiSuggestion: 'Certifies commodity quality at delivery',
        required: true,
      },
      {
        id: 'trustee',
        label: 'Trustee',
        type: 'select',
        aiSuggestion: 'Independent trustee',
        required: true,
      },
      {
        id: 'issuer',
        label: 'Issuer',
        type: 'text',
        defaultValue: 'You',
        aiSuggestion: 'Current user',
        required: true,
      },
    ],
    complianceStandards: [
      'AAOIFI Shariah Standard 10 (Salam)',
      'AAOIFI Shariah Standard 62 (Sukuk)',
      'IIFM Salam Standards',
    ],
  },

  // ==================== OTHER METHODOLOGIES (Semi-realistic inferred forms) ====================

  // MURABAHA (Non-Sukuk trade finance)
  murabaha: {
    name: 'Murabaha Trade Finance',
    description: 'Cost-plus trade financing for working capital needs',
    basicInfo: [
      {
        id: 'buyer_name',
        label: 'Buyer Name',
        type: 'text',
        placeholder: 'e.g., Al Amanah Trading LLC',
        aiSuggestion: 'Al Amanah Trading LLC',
        required: true,
      },
      {
        id: 'goods_description',
        label: 'Goods Description',
        type: 'text',
        placeholder: 'e.g., Industrial machinery',
        aiSuggestion: 'Describe the goods being financed',
        required: true,
      },
      {
        id: 'cost_price',
        label: 'Cost Price (USD)',
        type: 'number',
        placeholder: '500000',
        aiSuggestion: "Bank's purchase cost",
        required: true,
      },
      {
        id: 'profit_amount',
        label: 'Profit Amount (USD)',
        type: 'number',
        placeholder: '25000',
        aiSuggestion: 'Fixed profit markup',
        required: true,
      },
      {
        id: 'payment_tenor_months',
        label: 'Payment Tenor (Months)',
        type: 'number',
        placeholder: '12',
        aiSuggestion: 'Deferred payment period: 6-24 months typical',
        required: true,
      },
    ],
    roles: [
      {
        id: 'shariah_board',
        label: 'Shariah Advisory Board',
        type: 'select',
        aiSuggestion: 'Required for Murabaha validation',
        required: true,
      },
      {
        id: 'buyer',
        label: 'Buyer',
        type: 'text',
        defaultValue: 'You',
        aiSuggestion: 'Current user',
        required: true,
      },
      {
        id: 'seller',
        label: 'Seller/Supplier',
        type: 'select',
        aiSuggestion: 'Original goods supplier',
        required: true,
      },
    ],
    complianceStandards: [
      'AAOIFI Shariah Standard 8 (Murabaha)',
      'IIFM Murabaha Standards',
    ],
  },

  // IJARAH (Non-Sukuk leasing)
  ijarah: {
    name: 'Ijarah Lease Agreement',
    description: 'Operating or finance lease for equipment and property',
    basicInfo: [
      {
        id: 'lessee_name',
        label: 'Lessee Name',
        type: 'text',
        placeholder: 'e.g., Gulf Logistics Co.',
        aiSuggestion: 'Gulf Logistics Co.',
        required: true,
      },
      {
        id: 'asset_description',
        label: 'Asset Description',
        type: 'text',
        placeholder: 'e.g., Fleet of 20 cargo trucks',
        aiSuggestion: 'Describe the asset being leased',
        required: true,
      },
      {
        id: 'asset_value',
        label: 'Asset Value (USD)',
        type: 'number',
        placeholder: '2000000',
        aiSuggestion: 'Total value of leased asset',
        required: true,
      },
      {
        id: 'monthly_rental',
        label: 'Monthly Rental (USD)',
        type: 'number',
        placeholder: '50000',
        aiSuggestion: 'Fixed periodic rental amount',
        required: true,
      },
      {
        id: 'lease_period_years',
        label: 'Lease Period (Years)',
        type: 'number',
        placeholder: '3',
        aiSuggestion: 'Operating lease: 1-5 years; Finance lease: 5-15 years',
        required: true,
      },
      {
        id: 'purchase_option',
        label: 'Purchase Option at End',
        type: 'select',
        options: ['Yes - Finance Lease', 'No - Operating Lease', 'Market Value Option'],
        aiSuggestion: 'Finance lease includes ownership transfer',
        required: true,
      },
    ],
    roles: [
      {
        id: 'shariah_board',
        label: 'Shariah Advisory Board',
        type: 'select',
        aiSuggestion: 'Validates lease structure and ownership',
        required: true,
      },
      {
        id: 'lessor',
        label: 'Lessor (Owner)',
        type: 'select',
        aiSuggestion: 'Islamic bank or leasing company',
        required: true,
      },
      {
        id: 'lessee',
        label: 'Lessee',
        type: 'text',
        defaultValue: 'You',
        aiSuggestion: 'Current user',
        required: true,
      },
    ],
    complianceStandards: [
      'AAOIFI Shariah Standard 9 (Ijarah)',
      'IIFM Ijarah Standards',
    ],
  },

  // TAKAFUL (Islamic insurance)
  takaful: {
    name: 'Takaful Policy',
    description: 'Cooperative Islamic insurance based on mutual guarantee',
    basicInfo: [
      {
        id: 'participant_name',
        label: 'Participant Name',
        type: 'text',
        placeholder: 'e.g., Ahmed Al-Mansour',
        aiSuggestion: 'Ahmed Al-Mansour',
        required: true,
      },
      {
        id: 'takaful_type',
        label: 'Takaful Type',
        type: 'select',
        options: ['General Takaful (Property/Casualty)', 'Family Takaful (Life)', 'Health Takaful', 'Motor Takaful'],
        aiSuggestion: 'General Takaful for property/business risks',
        required: true,
      },
      {
        id: 'coverage_amount',
        label: 'Coverage Amount (USD)',
        type: 'number',
        placeholder: '1000000',
        aiSuggestion: 'Sum covered in case of claim',
        required: true,
      },
      {
        id: 'contribution_amount',
        label: 'Monthly Contribution (USD)',
        type: 'number',
        placeholder: '500',
        aiSuggestion: 'Participant contribution to Takaful fund',
        required: true,
      },
      {
        id: 'policy_period_years',
        label: 'Policy Period (Years)',
        type: 'number',
        placeholder: '1',
        aiSuggestion: 'Typically 1 year for general Takaful, longer for family',
        required: true,
      },
      {
        id: 'takaful_model',
        label: 'Takaful Model',
        type: 'select',
        options: ['Mudaraba (Profit-sharing)', 'Wakalah (Agency)', 'Hybrid Wakalah-Mudaraba'],
        aiSuggestion: 'Wakalah most common for general Takaful',
        required: true,
      },
    ],
    roles: [
      {
        id: 'shariah_board',
        label: 'Shariah Supervisory Board',
        type: 'select',
        aiSuggestion: 'Oversees Takaful operations and fund management',
        required: true,
      },
      {
        id: 'takaful_operator',
        label: 'Takaful Operator (Wakeel)',
        type: 'select',
        aiSuggestion: 'Manages Takaful fund',
        required: true,
      },
      {
        id: 'participant',
        label: 'Participant',
        type: 'text',
        defaultValue: 'You',
        aiSuggestion: 'Current user',
        required: true,
      },
    ],
    complianceStandards: [
      'AAOIFI Shariah Standard 26 (Takaful)',
      'IFSB Takaful Standards',
    ],
  },

  // WAKALA (Agency agreement)
  wakala: {
    name: 'Wakala Agency Agreement',
    description: 'Agency-based investment or service arrangement',
    basicInfo: [
      {
        id: 'principal_name',
        label: 'Principal (Muwakkil) Name',
        type: 'text',
        placeholder: 'e.g., Emirates Investment Holdings',
        aiSuggestion: 'Emirates Investment Holdings',
        required: true,
      },
      {
        id: 'investment_purpose',
        label: 'Investment/Service Purpose',
        type: 'text',
        placeholder: 'e.g., Real estate portfolio management',
        aiSuggestion: 'Describe the agency mandate',
        required: true,
      },
      {
        id: 'principal_capital',
        label: 'Principal Capital (USD)',
        type: 'number',
        placeholder: '10000000',
        aiSuggestion: 'Funds entrusted to agent',
        required: true,
      },
      {
        id: 'agency_fee_percent',
        label: 'Agency Fee (%)',
        type: 'number',
        placeholder: '1.5',
        aiSuggestion: 'Fixed fee: 1-3% typical; or lump sum',
        required: true,
      },
      {
        id: 'incentive_fee',
        label: 'Performance Incentive Fee (%)',
        type: 'number',
        placeholder: '10',
        aiSuggestion: 'Optional: 5-15% of profits above hurdle rate',
        required: false,
      },
      {
        id: 'contract_duration_years',
        label: 'Contract Duration (Years)',
        type: 'number',
        placeholder: '3',
        aiSuggestion: 'Wakala contracts: 1-5 years typical',
        required: true,
      },
    ],
    roles: [
      {
        id: 'shariah_board',
        label: 'Shariah Advisory Board',
        type: 'select',
        aiSuggestion: 'Validates investment activities',
        required: true,
      },
      {
        id: 'wakeel',
        label: 'Agent (Wakeel)',
        type: 'select',
        aiSuggestion: 'Investment manager or service provider',
        required: true,
      },
      {
        id: 'principal',
        label: 'Principal (Muwakkil)',
        type: 'text',
        defaultValue: 'You',
        aiSuggestion: 'Current user',
        required: true,
      },
    ],
    complianceStandards: [
      'AAOIFI Shariah Standard 23 (Wakalah)',
      'IIFM Wakalah Standards',
    ],
  },
}

export function Step2ConfigureDetails() {
  const execution = useWorkflowStore((state) => state.execution)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAISuggestions, setShowAISuggestions] = useState(true)

  // CONDITIONAL FORM SELECTION based on selected template
  // Maps template names/IDs to form config keys
  const getFormConfig = (): FormConfig => {
    const templateName = (execution as any)?.selectedTemplate?.name?.toLowerCase() || ''
    const templateId = (execution as any)?.selectedTemplate?.id?.toLowerCase() || execution?.workflowTemplateId?.toLowerCase() || ''

    // Try to match template by ID or name
    // Priority: exact ID match > name match > fallback to sukuk_ijara
    if (FORM_CONFIGS[templateId]) {
      return FORM_CONFIGS[templateId]
    }

    // Match by name patterns
    if (templateName.includes('ijara') || templateName.includes('ijarah')) {
      if (templateName.includes('sukuk')) return FORM_CONFIGS.sukuk_ijara
      return FORM_CONFIGS.ijarah
    }
    if (templateName.includes('murabaha') || templateName.includes('murabahah')) {
      if (templateName.includes('sukuk')) return FORM_CONFIGS.sukuk_murabaha
      return FORM_CONFIGS.murabaha
    }
    if (templateName.includes('musharaka') || templateName.includes('musharakah')) {
      return FORM_CONFIGS.sukuk_musharaka
    }
    if (templateName.includes('mudaraba') || templateName.includes('mudarabah')) {
      return FORM_CONFIGS.sukuk_mudaraba
    }
    if (templateName.includes('istisna') || templateName.includes('istisnaa')) {
      return FORM_CONFIGS.sukuk_istisna
    }
    if (templateName.includes('salam')) {
      return FORM_CONFIGS.sukuk_salam
    }
    if (templateName.includes('takaful')) {
      return FORM_CONFIGS.takaful
    }
    if (templateName.includes('wakala') || templateName.includes('wakalah')) {
      return FORM_CONFIGS.wakala
    }
    if (templateName.includes('sukuk')) {
      // Generic sukuk - default to Ijara (most common)
      return FORM_CONFIGS.sukuk_ijara
    }

    // Fallback to Sukuk Ijara (60% market share, safest default)
    return FORM_CONFIGS.sukuk_ijara
  }

  const currentFormConfig = getFormConfig()

  // Update field value
  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    // Clear error when user types
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  // Apply AI suggestion to field
  const applyAISuggestion = (fieldId: string, suggestion: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: suggestion }))
  }

  // Basic validation using current form config
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Check required basic info fields
    currentFormConfig.basicInfo.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`
      }
    })

    // Validate amount fields (applies to all Sukuk types and some other methodologies)
    const amountFields = ['issue_amount', 'total_capital', 'capital_amount', 'advance_payment', 'coverage_amount']
    amountFields.forEach((fieldId) => {
      if (formData[fieldId]) {
        const amount = parseFloat(formData[fieldId])
        // AAOIFI minimum for Sukuk issuance (if applicable)
        if (fieldId === 'issue_amount' && amount < 1000000) {
          newErrors[fieldId] = 'AAOIFI requires minimum $1M for Sukuk issuance'
        }
      }
    })

    // Check required roles
    currentFormConfig.roles.forEach((role) => {
      if (role.required && !formData[role.id] && !role.defaultValue) {
        newErrors[role.id] = `${role.label} must be assigned`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: Save to workflow store
      console.log('Form validated successfully:', formData)
    } else {
      console.log('Validation errors:', errors)
    }
  }

  return (
    <div className="space-y-6">
      {/* Explainer */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Configure Your Workflow: {currentFormConfig.name}</AlertTitle>
        <AlertDescription>
          {currentFormConfig.description}. AI will suggest values based on industry standards and best practices.
        </AlertDescription>
      </Alert>

      {/* Show selected template */}
      {(execution as any)?.selectedTemplate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Selected Template</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {(execution as any).selectedTemplate.name}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {(execution as any).selectedTemplate.category || 'Islamic Finance'}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* AI Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Assistance</span>
        </div>
        <Button
          variant={showAISuggestions ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowAISuggestions(!showAISuggestions)}
        >
          {showAISuggestions ? 'Enabled' : 'Disabled'}
        </Button>
      </div>

      {/* SECTION 1: Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
          <CardDescription className="text-sm">
            {currentFormConfig.name} - Core workflow parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentFormConfig.basicInfo.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              <div className="flex gap-2">
                {/* Input Field */}
                {field.type === 'text' || field.type === 'number' || field.type === 'date' ? (
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className={errors[field.id] ? 'border-destructive' : ''}
                  />
                ) : field.type === 'select' ? (
                  <Select
                    value={formData[field.id]}
                    onValueChange={(value) => handleFieldChange(field.id, value)}
                  >
                    <SelectTrigger className={errors[field.id] ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : null}

                {/* AI Suggestion Button */}
                {showAISuggestions && field.aiSuggestion && (
                  <Button
                    variant="outline"
                    size="icon"
                    title={field.aiSuggestion}
                    onClick={() =>
                      applyAISuggestion(
                        field.id,
                        field.type === 'select' && field.options
                          ? field.options[0]
                          : field.placeholder || ''
                      )
                    }
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                  </Button>
                )}
              </div>

              {/* AI Hint */}
              {showAISuggestions && field.aiSuggestion && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  AI: {field.aiSuggestion}
                </p>
              )}

              {/* Error Message */}
              {errors[field.id] && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SECTION 2: Compliance & Standards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compliance & Standards</CardTitle>
          <CardDescription className="text-sm">
            Automatically applied based on {currentFormConfig.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {currentFormConfig.complianceStandards.map((standard, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>{standard} (auto-applied)</span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-2">
            Standards are embedded in the workflow template and will be validated automatically
          </p>
        </CardContent>
      </Card>

      {/* SECTION 3: Role Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Role Assignments
          </CardTitle>
          <CardDescription className="text-sm">
            Assign team members to required {currentFormConfig.name} roles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentFormConfig.roles.map((role) => (
            <div key={role.id} className="space-y-2">
              <Label htmlFor={role.id}>
                {role.label}
                {role.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              <div className="flex gap-2">
                {role.defaultValue ? (
                  <Input
                    id={role.id}
                    value={role.defaultValue}
                    disabled
                    className="bg-muted"
                  />
                ) : (
                  <Select
                    value={formData[role.id]}
                    onValueChange={(value) => handleFieldChange(role.id, value)}
                  >
                    <SelectTrigger className={errors[role.id] ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Assign user..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user_1">Dr. Ahmed Al-Mansour (Shariah Scholar)</SelectItem>
                      <SelectItem value="user_2">Sarah Khan (Certified Auditor)</SelectItem>
                      <SelectItem value="user_3">Mohamed Rashid (Finance Director)</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {showAISuggestions && role.aiSuggestion && (
                  <Button variant="outline" size="icon" title={role.aiSuggestion}>
                    <Sparkles className="h-4 w-4 text-primary" />
                  </Button>
                )}
              </div>

              {/* AI Hint */}
              {showAISuggestions && role.aiSuggestion && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  AI: {role.aiSuggestion}
                </p>
              )}

              {/* Error Message */}
              {errors[role.id] && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors[role.id]}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SECTION 4: Upload Supporting Documents (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Upload Supporting Documents
          </CardTitle>
          <CardDescription className="text-sm">
            Optional: Add financial statements, valuations, or other supporting documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Coming Soon</AlertTitle>
            <AlertDescription>
              AI-powered document extraction will automatically fill form fields based on uploaded
              PDFs. For now, configure manually above.
            </AlertDescription>
          </Alert>

          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload financial statements, asset valuations, or other documents
            </p>
            <Button variant="outline" disabled>
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Errors</AlertTitle>
          <AlertDescription>
            Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''}{' '}
            before proceeding to the next step.
          </AlertDescription>
        </Alert>
      )}

      {/* Validate Button */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="lg">
          Validate Configuration
        </Button>
      </div>
    </div>
  )
}
