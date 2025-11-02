export interface TestCase {
  id: string;
  projectId: string;
  title: string;
  description: string;
  preconditions: string;
  steps: string[];
  expectedResults: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'functional' | 'integration' | 'regression' | 'compliance';
  status: 'draft' | 'ready' | 'executed' | 'passed' | 'failed';
  compliance?: string[];
  traceability?: {
    requirementId: string;
    requirementDescription?: string;
    riskLevel?: 'High' | 'Medium' | 'Low';
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  executedAt?: string;
  executedBy?: string;
}

export interface GenerateTestCasesRequest {
  documentIds?: string[];
  requirements: string;
  complianceStandards: string[];
  projectId: string;
  userId: string;
}

export interface ComplianceAnalysis {
  analysisId: string;
  testCaseIds: string[];
  standards: string[];
  overallScore: number;
  standardsBreakdown: Array<{
    name: string;
    score: number;
    status: 'compliant' | 'warning' | 'non-compliant';
    findings: string[];
  }>;
  recommendations: string[];
  analyzedAt: string;
}
