import type { ValidationResults } from '../types/digitization'

export const mockValidationResults: ValidationResults = {
  passed: true,
  tests_run: 12,
  tests_passed: 11,
  tests_failed: 0,
  errors: [],
  warnings: ["Schema 'audit-trail' has optional field without default value"],
  test_details: [
    { test_name: 'Schema Validation', status: 'passed', message: 'All 3 schemas are valid Guardian schemas' },
    { test_name: 'Policy Workflow Completeness', status: 'passed', message: 'All workflow blocks properly connected' },
    { test_name: 'Role Assignment Check', status: 'passed', message: 'All blocks have assigned roles' },
    { test_name: 'Calculation Logic Syntax', status: 'passed', message: 'JavaScript code is syntactically valid' },
    { test_name: 'Calculation Logic Execution', status: 'passed', message: 'Test run successful with sample data' },
    { test_name: 'Shariah Compliance Rules', status: 'passed', message: 'All compliance conditions present in workflow' },
    { test_name: 'Required Fields Check', status: 'passed', message: 'All required schema fields defined' },
    { test_name: 'Data Type Consistency', status: 'passed', message: 'No type mismatches found' },
    { test_name: 'Workflow Termination', status: 'passed', message: 'All workflow paths reach completion' },
    { test_name: 'Documentation Completeness', status: 'passed', message: 'All artifacts have descriptions' },
    { test_name: 'Profit Ratio Validation', status: 'passed', message: 'Profit sharing ratios sum to 100%' },
    {
      test_name: 'Optional Field Defaults',
      status: 'warning',
      message: 'Some optional fields lack default values',
    },
  ],
}
