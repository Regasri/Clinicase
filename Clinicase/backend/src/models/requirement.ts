export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: 'functional' | 'non-functional' | 'compliance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'draft' | 'approved' | 'implemented' | 'tested';
  complianceStandards?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TraceabilityItem {
  requirementId: string;
  requirementDescription: string;
  testCaseIds: string[];
  riskLevel: 'High' | 'Medium' | 'Low';
  complianceStandards: string[];
  coverage: number;
}

export interface TraceabilityMatrix {
  matrixId: string;
  projectId: string;
  matrix: TraceabilityItem[];
  overallCoverage: number;
  generatedAt: string;
}
