'use client'

/**
 * STEP 7: CONFIGURE DETAILS
 * ==========================
 * Dynamic form composition from all 4 selected components (Shariah, Jurisdiction, Accounting, Impact).
 *
 * MODULAR ARCHITECTURE APPROACH:
 * - No hardcoded FORM_CONFIGS
 * - Fields composed from:
 *   1. selectedShariahStructure.baseFields
 *   2. selectedJurisdiction.additionalFields
 *   3. selectedAccounting.additionalFields
 *   4. selectedImpact.additionalFields
 *   5. selectedTakaful.additionalFields (if enabled)
 *
 * WHAT THIS STEP DOES:
 * - Dynamic form generation from all component fields
 * - AI auto-fill suggestions for field values
 * - Real-time validation
 * - Document upload with AI extraction (placeholder for future)
 *
 * USER-FACING TERMINOLOGY:
 * - "Configure Details" (not "fill form")
 * - "Template Configuration" (composition of 4 components)
 * - Standards mentioned by name (AAOIFI, IIFM, ICMA, etc.)
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
  AlertCircle,
  Building2,
  MapPin,
  BookOpen,
  Target,
  X,
} from 'lucide-react'
import type { FormField } from '@/lib/types'

export function Step7ConfigureDetails() {
  const execution = useWorkflowStore((state) => state.execution)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAISuggestions, setShowAISuggestions] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const selectedShariahStructure = execution?.selectedShariahStructure
  const selectedJurisdiction = execution?.selectedJurisdiction
  const selectedAccounting = execution?.selectedAccounting
  const selectedImpacts = execution?.selectedImpacts || []
  const selectedTakaful = execution?.selectedTakaful
  const dealConfiguration = execution?.dealConfiguration

  // DYNAMIC FIELD COMPOSITION from all 4 components
  const allFields: FormField[] = [
    ...(selectedShariahStructure?.baseFields || []),
    ...(selectedJurisdiction?.additionalFields || []),
    ...(selectedAccounting?.additionalFields || []),
    // Flatten all impact framework fields
    ...selectedImpacts.flatMap(impact => impact.additionalFields || []),
    ...(selectedTakaful?.enabled ? selectedTakaful.additionalFields || [] : []),
  ]

  // Organize fields by source for better UI organization
  const fieldsBySource = {
    shariah: selectedShariahStructure?.baseFields || [],
    jurisdiction: selectedJurisdiction?.additionalFields || [],
    accounting: selectedAccounting?.additionalFields || [],
    impact: selectedImpacts.flatMap(impact => impact.additionalFields || []),
    takaful: selectedTakaful?.enabled ? selectedTakaful.additionalFields || [] : [],
  }

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
  const applyAISuggestion = (field: FormField) => {
    // For select fields, use first option; for others, use placeholder or aiSuggestion
    let suggestion = field.aiSuggestion
    if (field.type === 'select' && field.options && field.options.length > 0) {
      suggestion = field.options[0]
    } else if (field.placeholder) {
      suggestion = field.placeholder
    }
    setFormData((prev) => ({ ...prev, [field.id]: suggestion }))
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      setUploadedFiles((prev) => [...prev, ...newFiles])
      console.log('Files uploaded:', newFiles.map((f) => f.name))
    }
  }

  // Remove uploaded file
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Basic validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Check all required fields
    allFields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`
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
      console.log('Configuration:', dealConfiguration)
    } else {
      console.log('Validation errors:', errors)
    }
  }

  // Render a single field
  const renderField = (field: FormField) => (
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
            value={formData[field.id] || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={errors[field.id] ? 'border-destructive' : ''}
          />
        ) : field.type === 'select' ? (
          <Select
            value={formData[field.id] || field.defaultValue}
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
            onClick={() => applyAISuggestion(field)}
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
  )

  // Show warning if configuration not complete
  if (!dealConfiguration || !dealConfiguration.isValid) {
    return (
      <div className="space-y-6">
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Incomplete or Invalid</AlertTitle>
          <AlertDescription>
            Please complete and validate your 4-component configuration in Step 6 before
            configuring details. All 4 components (Shariah Structure, Jurisdiction, Accounting,
            Impact Metrics) must be selected and validated.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Explainer */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Configure Your Deal Details</AlertTitle>
        <AlertDescription>
          Dynamic form composed from your selected components: {selectedShariahStructure?.name},{' '}
          {selectedJurisdiction?.name}, {selectedAccounting?.name}, {selectedImpacts.map(i => i.name).join(', ')}.
          AI will suggest values based on industry standards and best practices.
        </AlertDescription>
      </Alert>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Selected Configuration</CardTitle>
          <CardDescription className="text-sm">{dealConfiguration.configurationName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span>{selectedShariahStructure?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{selectedJurisdiction?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>{selectedAccounting?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span>{selectedImpacts.length} Impact Framework{selectedImpacts.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* DYNAMIC FORM SECTIONS */}

      {/* Shariah Structure Fields */}
      {fieldsBySource.shariah.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {selectedShariahStructure?.name} Details
            </CardTitle>
            <CardDescription className="text-sm">
              Structure-specific configuration fields
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fieldsBySource.shariah.map((field) => renderField(field))}
          </CardContent>
        </Card>
      )}

      {/* Jurisdiction Fields */}
      {fieldsBySource.jurisdiction.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {selectedJurisdiction?.name} Requirements
            </CardTitle>
            <CardDescription className="text-sm">
              Jurisdiction-specific regulatory fields
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fieldsBySource.jurisdiction.map((field) => renderField(field))}
          </CardContent>
        </Card>
      )}

      {/* Accounting Framework Fields */}
      {fieldsBySource.accounting.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {selectedAccounting?.name} Fields
            </CardTitle>
            <CardDescription className="text-sm">
              Accounting framework-specific requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fieldsBySource.accounting.map((field) => renderField(field))}
          </CardContent>
        </Card>
      )}

      {/* Impact Metrics Fields */}
      {fieldsBySource.impact.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Impact Metrics Configuration
            </CardTitle>
            <CardDescription className="text-sm">
              {selectedImpacts.length} framework{selectedImpacts.length > 1 ? 's' : ''} - Impact metrics and ESG reporting fields
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fieldsBySource.impact.map((field) => renderField(field))}
          </CardContent>
        </Card>
      )}

      {/* Takaful Overlay Fields (if enabled) */}
      {fieldsBySource.takaful.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Takaful Overlay Configuration</CardTitle>
            <CardDescription className="text-sm">
              Optional Takaful insurance fields
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fieldsBySource.takaful.map((field) => renderField(field))}
          </CardContent>
        </Card>
      )}

      {/* Compliance Standards Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Applicable Compliance Standards</CardTitle>
          <CardDescription className="text-sm">
            Automatically applied based on your component selections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Shariah Standards */}
          {selectedShariahStructure?.aaoifiStandards.map((standard, idx) => (
            <div key={`shariah-${idx}`} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>{standard} (Shariah Structure)</span>
            </div>
          ))}

          {/* Accounting Standards */}
          {selectedAccounting?.applicableStandards.slice(0, 3).map((standard, idx) => (
            <div key={`accounting-${idx}`} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>{standard} (Accounting)</span>
            </div>
          ))}

          {/* Impact Frameworks */}
          {selectedImpacts.map((impact) =>
            impact.framework && (
              <div key={impact.id} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>{impact.framework} (Impact Metrics)</span>
              </div>
            )
          )}

          <p className="text-xs text-muted-foreground mt-2">
            Standards are embedded in your configuration and will be validated automatically
          </p>
        </CardContent>
      </Card>

      {/* Upload Supporting Documents */}
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
          {uploadedFiles.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload financial statements, asset valuations, or other documents
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Supported formats: PDF, DOCX, XLSX (max 10MB each)
              </p>
              <label htmlFor="file-upload">
                <Button variant="outline" asChild>
                  <span>Select Files</span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx,.xls"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <label htmlFor="file-upload-more">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Add More Files
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload-more"
                  type="file"
                  multiple
                  accept=".pdf,.docx,.xlsx,.xls"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </>
          )}

          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Documents are optional but recommended. AI-powered extraction is coming soon to
              automatically populate fields from uploaded documents.
            </AlertDescription>
          </Alert>
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
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="lg">
          Save Draft
        </Button>
        <Button onClick={handleSubmit} size="lg">
          Validate & Continue
        </Button>
      </div>
    </div>
  )
}
