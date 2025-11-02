/**
 * Main Cloud Functions Entry Point
 * All HTTP Cloud Functions are exported from here
 */

// Document API
export { processDocument } from './api/documents';

// Test Case API
export { generateTestCases, analyzeCompliance, exportTestCases, getTraceabilityMatrix, queryComplianceContext } from './api/testcases';

// Integration API
export { exportToJira } from './api/integrations/jira';
export { exportToPolarion } from './api/integrations/polarion';
export { exportToAzureDevOps } from './api/integrations/azureDevOps';

// Auth API
export { getUserProfile, updateUserProfile } from './api/auth';

// Requirements API
export { createRequirement, getRequirements } from './api/requirements';
