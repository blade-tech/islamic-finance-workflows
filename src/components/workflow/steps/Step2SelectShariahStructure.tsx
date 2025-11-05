'use client'

/**
 * STEP 2: SELECT SHARIAH STRUCTURE
 * =================================
 * First component selection in the 4-component modular architecture.
 *
 * ARCHITECTURE:
 * - Shariah structures are CONTRACT TYPES (Ijara, Murabaha, etc.)
 * - Sukuk = securitized/certificated version of these contracts
 * - User selects: (1) Contract Type, (2) Securitize as Sukuk? YES/NO
 *
 * USER-FACING TERMINOLOGY:
 * - "Shariah Structure" = the Islamic finance contract mechanism
 * - "Securitize as Sukuk" = issue tradable certificates based on the contract
 * - Clear use cases and examples for each structure
 *
 * FEATURES:
 * - Grid display of all 6 Islamic finance structures
 * - Market share indicators
 * - Use case descriptions
 * - Sukuk securitization toggle (prominent placement)
 * - AI assistance for selection
 * - Required roles display
 * - AAOIFI standards compliance badges
 *
 * NOTE: This is Component 1 of 4 in the modular architecture.
 */

import { useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Building2,
  TrendingUp,
  Users,
  PieChart,
  Construction,
  Wheat,
  CheckCircle2,
  Sparkles,
  Info,
  FileText,
  Coins,
  Shield,
  Upload,
} from 'lucide-react'
import { ALL_SHARIAH_STRUCTURES } from '@/data/shariah-structures'
import type { ShariahStructure, TakafulOverlay } from '@/lib/types'
import { MethodologyUploadFlow } from '../MethodologyUploadFlow'

// Icon mapping for dynamic rendering
const ICON_MAP: Record<string, any> = {
  Building2,
  TrendingUp,
  Users,
  PieChart,
  Construction,
  Wheat,
}

export function Step2SelectShariahStructure() {
  const execution = useWorkflowStore((state) => state.execution)
  const setShariahStructure = useWorkflowStore((state) => state.setShariahStructure)
  const setIsSecuritized = useWorkflowStore((state) => state.setIsSecuritized)
  const setTakaful = useWorkflowStore((state) => state.setTakaful)

  const [selectedStructure, setSelectedStructure] = useState<ShariahStructure | null>(
    execution?.selectedShariahStructure || null
  )
  const [isSecuritized, setIsSecuritizedLocal] = useState<boolean>(
    execution?.isSecuritized || false
  )
  const [takaful, setTakafulLocal] = useState<TakafulOverlay>(
    execution?.selectedTakaful || { enabled: false }
  )

  const handleSelect = (structure: ShariahStructure) => {
    setSelectedStructure(structure)
    setShariahStructure(structure)
  }

  const handleSecuritizationToggle = (checked: boolean) => {
    setIsSecuritizedLocal(checked)
    setIsSecuritized(checked)
  }

  const handleTakafulToggle = (checked: boolean) => {
    const newTakaful: TakafulOverlay = checked
      ? {
          enabled: true,
          model: 'wakalah',
          coverageType: 'credit',
          provider: '',
          description: '',
        }
      : { enabled: false }

    setTakafulLocal(newTakaful)
    setTakaful(newTakaful)
  }

  const handleTakafulChange = (field: keyof TakafulOverlay, value: any) => {
    const newTakaful = { ...takaful, [field]: value }
    setTakafulLocal(newTakaful)
    setTakaful(newTakaful)
  }

  const getIcon = (iconName: string | undefined) => {
    if (!iconName || !ICON_MAP[iconName]) return Building2
    return ICON_MAP[iconName]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Select Shariah Structure</h2>
        <p className="text-muted-foreground mt-1">
          Choose the Islamic finance contract mechanism for your deal. You'll decide next whether to securitize it as Sukuk (tradable certificates) or use it for direct financing. (Component 1 of 4)
        </p>
      </div>

      {/* AI Guidance */}
      <Alert variant="info">
        <Sparkles className="h-4 w-4 text-blue-600" />
        <AlertTitle>AI Guidance</AlertTitle>
        <AlertDescription>
          <strong>Ijara</strong> (lease-based, 60% market share) is recommended for asset-backed deals.
          For trade finance, consider <strong>Murabaha</strong>. For partnerships, use <strong>Musharaka</strong> or <strong>Mudaraba</strong>.
          After selecting a structure, you'll choose whether to securitize it as Sukuk.
        </AlertDescription>
      </Alert>

      {/* Structure Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_SHARIAH_STRUCTURES.map((structure) => {
          const Icon = getIcon(structure.icon)
          const isSelected = selectedStructure?.id === structure.id

          return (
            <Card
              key={structure.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary border-primary' : ''
              }`}
              onClick={() => handleSelect(structure)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{structure.name}</CardTitle>
                      {structure.marketShare && (
                        <Badge variant="secondary" className="mt-1">
                          {structure.marketShare}% Market Share
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground">{structure.description}</p>

                {/* Use Cases */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Common Use Cases:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {structure.useCases.slice(0, 3).map((useCase, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Roles */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Required Roles:</h4>
                  <div className="flex flex-wrap gap-1">
                    {structure.requiredRoles.slice(0, 3).map((role, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                    {structure.requiredRoles.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{structure.requiredRoles.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* AAOIFI Standards */}
                <div>
                  <h4 className="text-sm font-medium mb-2">AAOIFI Standards:</h4>
                  <div className="flex flex-wrap gap-1">
                    {structure.aaoifiStandards.slice(0, 2).map((standard, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {standard.length > 30 ? standard.substring(0, 30) + '...' : standard}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Sukuk Securitization Toggle */}
      {selectedStructure && (
        <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Coins className="h-5 w-5 text-primary" />
                  <Label htmlFor="securitization-toggle" className="text-lg font-semibold cursor-pointer">
                    Securitize as Sukuk (Issue Tradable Certificates)
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Sukuk (ON)</strong>: Creates tradable Islamic certificates backed by {selectedStructure.name} contracts. Suitable for capital markets and investor distribution.
                  <br />
                  <strong>Direct Financing (OFF)</strong>: Uses {selectedStructure.name} contracts directly for bilateral financing, leasing, or trade. No securitization layer.
                </p>
                {isSecuritized && (
                  <Alert className="mt-3 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-sm">
                      <strong>Sukuk Mode Enabled:</strong> Your workflow will generate Sukuk issuance documentation with SPV structure, trustee roles, and certificate terms based on {selectedStructure.name} contracts.
                    </AlertDescription>
                  </Alert>
                )}
                {!isSecuritized && selectedStructure && (
                  <Alert className="mt-3 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm">
                      <strong>Direct Financing Mode:</strong> Your workflow will generate direct {selectedStructure.name} financing documentation without securitization.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <Switch
                id="securitization-toggle"
                checked={isSecuritized}
                onCheckedChange={handleSecuritizationToggle}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Takaful (Islamic Insurance) Configuration */}
      {selectedStructure && (
        <Card className="border-2 border-dashed border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/30">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Takaful Toggle */}
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <Label htmlFor="takaful-toggle" className="text-lg font-semibold cursor-pointer">
                      Add Takaful (Islamic Insurance)
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Takaful (ON)</strong>: Adds Islamic insurance coverage to your structure. Common for credit risk, asset protection, or commodity coverage.
                    <br />
                    <strong>No Takaful (OFF)</strong>: Proceeds without insurance overlay (most common for standard deals).
                  </p>
                </div>
                <Switch
                  id="takaful-toggle"
                  checked={takaful.enabled}
                  onCheckedChange={handleTakafulToggle}
                  className="mt-1"
                />
              </div>

              {/* Takaful Configuration Fields (visible when enabled) */}
              {takaful.enabled && (
                <div className="space-y-4 pl-8 border-l-2 border-blue-300">
                  {/* Takaful Model */}
                  <div className="space-y-2">
                    <Label htmlFor="takaful-model">Takaful Model</Label>
                    <Select
                      value={takaful.model || 'wakalah'}
                      onValueChange={(value) => handleTakafulChange('model', value as 'mudaraba' | 'wakalah' | 'hybrid')}
                    >
                      <SelectTrigger id="takaful-model">
                        <SelectValue placeholder="Select Takaful model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mudaraba">Mudaraba (Profit-Sharing)</SelectItem>
                        <SelectItem value="wakalah">Wakalah (Agency) - Most Common</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Wakalah + Mudaraba)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {takaful.model === 'mudaraba' && 'Profit-sharing model where surplus is shared between participants and operator.'}
                      {takaful.model === 'wakalah' && 'Agency model where operator receives fixed fee. Most widely used.'}
                      {takaful.model === 'hybrid' && 'Combines agency fee with profit-sharing of surplus.'}
                    </p>
                  </div>

                  {/* Coverage Type */}
                  <div className="space-y-2">
                    <Label htmlFor="coverage-type">Coverage Type</Label>
                    <Select
                      value={takaful.coverageType || 'credit'}
                      onValueChange={(value) => handleTakafulChange('coverageType', value as 'credit' | 'asset' | 'performance' | 'commodity')}
                    >
                      <SelectTrigger id="coverage-type">
                        <SelectValue placeholder="Select coverage type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Credit Risk Coverage</SelectItem>
                        <SelectItem value="asset">Asset Protection</SelectItem>
                        <SelectItem value="performance">Performance Guarantee</SelectItem>
                        <SelectItem value="commodity">Commodity/Trade Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {takaful.coverageType === 'credit' && 'Covers credit default risk (common for Sukuk and financing).'}
                      {takaful.coverageType === 'asset' && 'Protects underlying assets (common for Ijara leasing).'}
                      {takaful.coverageType === 'performance' && 'Guarantees performance obligations (construction, projects).'}
                      {takaful.coverageType === 'commodity' && 'Covers commodity and trade transactions (Murabaha, Salam).'}
                    </p>
                  </div>

                  {/* Provider (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="takaful-provider">Takaful Provider (Optional)</Label>
                    <Input
                      id="takaful-provider"
                      type="text"
                      placeholder="e.g., Takaful International, Re-Takaful Provider"
                      value={takaful.provider || ''}
                      onChange={(e) => handleTakafulChange('provider', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Name of the Takaful or Re-Takaful provider (leave blank if not yet selected).
                    </p>
                  </div>

                  {/* Description (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="takaful-description">Coverage Description (Optional)</Label>
                    <Input
                      id="takaful-description"
                      type="text"
                      placeholder="Brief description of coverage terms"
                      value={takaful.description || ''}
                      onChange={(e) => handleTakafulChange('description', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional details about coverage amount, terms, or specific conditions.
                    </p>
                  </div>

                  {/* Takaful Enabled Alert */}
                  <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm">
                      <strong>Takaful Enabled:</strong> Your workflow will include Islamic insurance ({takaful.model}) covering {takaful.coverageType?.replace('_', ' ')} for your {selectedStructure.name} structure.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Summary */}
      {selectedStructure && (
        <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Configuration Complete</AlertTitle>
          <AlertDescription>
            <strong>{selectedStructure.name}</strong> {isSecuritized ? 'Sukuk' : 'Direct Financing'} selected.{' '}
            {selectedStructure.marketShare && `(${selectedStructure.marketShare}% market share) `}
            <br />
            {isSecuritized ? (
              <span className="text-sm">
                You're creating <strong>Sukuk certificates</strong> backed by {selectedStructure.name} contracts.
              </span>
            ) : (
              <span className="text-sm">
                You're using <strong>{selectedStructure.name} contracts directly</strong> without securitization.
              </span>
            )}
            {takaful.enabled && (
              <>
                <br />
                <span className="text-sm mt-1 inline-block">
                  <strong>Takaful:</strong> {takaful.model} model with {takaful.coverageType?.replace('_', ' ')} coverage.
                </span>
              </>
            )}
            <br />
            <span className="text-sm mt-1 inline-block">
              Next: Select jurisdiction for regulatory framework.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Info Box */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>What are Shariah Structures and Sukuk?</AlertTitle>
        <AlertDescription>
          <strong>Shariah Structures</strong> are Islamic finance contract types (Ijara, Murabaha, etc.) that define the mechanism of the deal.
          <br /><br />
          <strong>Sukuk</strong> are Islamic certificates that <em>securitize</em> these contracts into tradable instruments. Think of it as:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Contract Type</strong> (Ijara, Murabaha, etc.) = the underlying Islamic finance mechanism</li>
            <li><strong>Sukuk</strong> = tradable certificates backed by those contracts (optional securitization layer)</li>
          </ul>
          <br />
          Not all Islamic finance uses Sukuk - you can use contracts directly for bilateral financing, leasing, or trade.
        </AlertDescription>
      </Alert>

      {/* Document Upload Section */}
      <Card className="border-2 border-dashed border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/30">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Upload className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg">Or Upload Your Own Methodology</CardTitle>
          </div>
          <CardDescription>
            Already have a methodology document (IIFM, AAOIFI, custom)? Upload it to digitize the policy intent and extract the Shariah structure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MethodologyUploadFlow />
        </CardContent>
      </Card>
    </div>
  )
}
