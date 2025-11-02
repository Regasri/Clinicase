import { VertexAI } from '@google-cloud/vertexai';
import { config } from '../config';

const vertexAI = new VertexAI({
  project: config.projectId,
  location: config.vertexAI.location,
});

export async function generateContent(prompt: string): Promise<string> {
  const generativeModel = vertexAI.getGenerativeModel({
    model: config.vertexAI.model,
  });

  const result = await generativeModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return responseText;
}

export async function generateTestCasesWithAI(params: {
  documentContext: string;
  requirements: string;
  complianceContext: string;
  standards: string[];
}): Promise<any[]> {
  const prompt = buildTestCasePrompt(params);
  const response = await generateContent(prompt);
  return parseTestCasesFromResponse(response);
}

export async function analyzeComplianceWithAI(params: {
  testCases: any[];
  standards: string[];
  complianceRequirements: string[];
}): Promise<any> {
  const prompt = `Analyze the following test cases for compliance with ${params.standards.join(', ')}.

TEST CASES:
${JSON.stringify(params.testCases, null, 2)}

COMPLIANCE REQUIREMENTS:
${params.complianceRequirements.join('\n\n')}

Provide:
1. Overall compliance score (0-100)
2. For each standard: score, status (compliant/warning/non-compliant), specific findings
3. Recommendations for improvement

Return as JSON:
{
  "overallScore": number,
  "standardsBreakdown": [
    {
      "name": "standard name",
      "score": number,
      "status": "compliant|warning|non-compliant",
      "findings": ["finding1", "finding2"]
    }
  ],
  "recommendations": ["rec1", "rec2"]
}`;

  const response = await generateContent(prompt);
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
}

function buildTestCasePrompt(params: {
  documentContext: string;
  requirements: string;
  complianceContext: string;
  standards: string[];
}): string {
  return `You are an expert healthcare QA engineer specializing in test case generation for medical devices and healthcare systems.

Generate comprehensive test cases based on the following information:

DOCUMENT CONTEXT:
${params.documentContext}

REQUIREMENTS:
${params.requirements}

COMPLIANCE STANDARDS: ${params.standards.join(', ')}

COMPLIANCE REQUIREMENTS:
${params.complianceContext}

Generate 5-10 detailed test cases that:
1. Cover all specified requirements
2. Address compliance standards (${params.standards.join(', ')})
3. Include edge cases and error scenarios
4. Follow healthcare industry best practices

For each test case, provide:
- title: Clear, descriptive title
- description: What is being tested
- preconditions: Setup required before testing
- steps: Array of test steps
- expectedResults: Expected outcome
- priority: critical/high/medium/low
- type: functional/integration/regression/compliance
- compliance: Array of applicable standards
- traceability: { requirementId, requirementDescription, riskLevel }

Return ONLY a JSON array of test cases, no additional text.`;
}

function parseTestCasesFromResponse(response: string): any[] {
  try {
    // Remove markdown code blocks if present
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse test cases:', error);
    return [];
  }
}
