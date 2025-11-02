import { processDocument } from './documentAI';
import { generateTestCasesWithAI } from './geminiLLM';
import { getComplianceContext } from './rag';
import { firestore, collections, pubsub, topics } from './firebase';
import { TestCase, GenerateTestCasesRequest } from '../models/testcase';

export async function orchestrateTestCaseGeneration(
  request: GenerateTestCasesRequest
): Promise<TestCase[]> {
  const { documentIds, requirements, complianceStandards, projectId, userId } = request;

  // Step 1: Gather document context
  let documentContext = '';
  if (documentIds && documentIds.length > 0) {
    const documents = await Promise.all(
      documentIds.map((id) =>
        firestore.collection(collections.documents).doc(id).get()
      )
    );
    documentContext = documents
      .map((doc) => doc.data()?.extractedText || '')
      .join('\n\n');
  }

  // Step 2: Get compliance context using RAG
  const complianceContext = await getComplianceContext(complianceStandards);

  // Step 3: Generate test cases using Gemini
  const generatedTestCases = await generateTestCasesWithAI({
    documentContext,
    requirements,
    complianceContext,
    standards: complianceStandards,
  });

  // Step 4: Save test cases to Firestore
  const testCases: TestCase[] = [];
  const batch = firestore.batch();

  for (const tc of generatedTestCases) {
    const testCaseId = `tc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const testCase: TestCase = {
      ...tc,
      id: testCaseId,
      projectId,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    };

    const docRef = firestore.collection(collections.testCases).doc(testCaseId);
    batch.set(docRef, testCase);
    testCases.push(testCase);
  }

  await batch.commit();

  // Step 5: Publish event
  await pubsub.topic(topics.testCaseGenerated).publishMessage({
    json: {
      projectId,
      testCaseIds: testCases.map((tc) => tc.id),
      userId,
      timestamp: new Date().toISOString(),
    },
  });

  return testCases;
}

export function calculateComplianceScore(
  testCases: any[],
  standards: string[]
): number {
  if (testCases.length === 0 || standards.length === 0) return 0;

  let totalCoverage = 0;
  standards.forEach((standard) => {
    const coveringTests = testCases.filter(
      (tc) => tc.compliance && tc.compliance.includes(standard)
    );
    totalCoverage += (coveringTests.length / testCases.length) * 100;
  });

  return Math.round(totalCoverage / standards.length);
}
