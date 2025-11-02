import * as functions from '@google-cloud/functions-framework';
import { orchestrateTestCaseGeneration, calculateComplianceScore } from '../services/agentBuilder';
import { analyzeComplianceWithAI } from '../services/geminiLLM';
import { queryVectorDatabase } from '../services/rag';
import { exportTestCases } from '../services/export';
import { firestore, collections } from '../services/firebase';
import { config, corsOptions } from '../config';
import { GenerateTestCasesRequest, ComplianceAnalysis } from '../models/testcase';

// Generate Test Cases
functions.http('generateTestCases', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const request: GenerateTestCasesRequest = req.body;

    if (!request.requirements || !request.complianceStandards) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const testCases = await orchestrateTestCaseGeneration(request);
    const complianceScore = calculateComplianceScore(testCases, request.complianceStandards);

    res.status(200).json({
      success: true,
      data: {
        testCases,
        count: testCases.length,
        complianceScore,
      },
    });
  } catch (error) {
    console.error('Test case generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Analyze Compliance
functions.http('analyzeCompliance', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { testCaseIds, standards } = req.body;

    // Fetch test cases
    const testCases = await Promise.all(
      testCaseIds.map((id: string) =>
        firestore.collection(collections.testCases).doc(id).get()
      )
    );

    const testCaseData = testCases.map((doc) => doc.data());

    // Get compliance requirements
    const complianceRequirements = await Promise.all(
      standards.map((standard: string) =>
        queryVectorDatabase({
          query: `Compliance requirements for ${standard}`,
          topK: 5,
        })
      )
    );

    // Analyze with AI
    const analysis = await analyzeComplianceWithAI({
      testCases: testCaseData,
      standards,
      complianceRequirements: complianceRequirements.flat().map((r) => r.content),
    });

    // Save to Firestore
    const analysisId = `analysis_${Date.now()}`;
    const complianceAnalysis: ComplianceAnalysis = {
      analysisId,
      testCaseIds,
      standards,
      ...analysis,
      analyzedAt: new Date().toISOString(),
    };

    await firestore
      .collection(collections.compliance)
      .doc(analysisId)
      .set(complianceAnalysis);

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Compliance analysis error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Export Test Cases
functions.http('exportTestCases', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { testCaseIds, format = 'json' } = req.body;

    // Fetch test cases
    const testCases = await Promise.all(
      testCaseIds.map((id: string) =>
        firestore.collection(collections.testCases).doc(id).get()
      )
    );

    const testCaseData = testCases.map((doc) => doc.data());

    // Export in specified format
    const downloadUrl = await exportTestCases(testCaseData, format);

    res.status(200).json({
      success: true,
      data: { downloadUrl },
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get Traceability Matrix
functions.http('getTraceabilityMatrix', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { projectId } = req.body;

    // Fetch all test cases
    let query = firestore.collection(collections.testCases);
    if (projectId) {
      query = query.where('projectId', '==', projectId) as any;
    }

    const snapshot = await query.get();
    const testCases = snapshot.docs.map((doc) => doc.data());

    // Group by requirements
    const requirementMap = new Map<string, any>();

    testCases.forEach((tc) => {
      if (!tc.traceability?.requirementId) return;

      const reqId = tc.traceability.requirementId;
      if (!requirementMap.has(reqId)) {
        requirementMap.set(reqId, {
          requirementId: reqId,
          requirementDescription: tc.traceability.requirementDescription || reqId,
          testCaseIds: [],
          riskLevel: tc.traceability.riskLevel || 'Medium',
          complianceStandards: new Set<string>(),
          coverage: 0,
        });
      }

      const req = requirementMap.get(reqId);
      req.testCaseIds.push(tc.id);
      (tc.compliance || []).forEach((std: string) => req.complianceStandards.add(std));
    });

    // Calculate coverage
    const matrix = Array.from(requirementMap.values()).map((req) => ({
      ...req,
      complianceStandards: Array.from(req.complianceStandards),
      coverage: Math.min(100, req.testCaseIds.length * 20),
    }));

    const overallCoverage =
      matrix.length > 0 ? matrix.reduce((sum, r) => sum + r.coverage, 0) / matrix.length : 0;

    res.status(200).json({
      success: true,
      data: {
        matrix,
        overallCoverage: Math.round(overallCoverage),
      },
    });
  } catch (error) {
    console.error('Traceability matrix error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Query Compliance Context (RAG)
functions.http('queryComplianceContext', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { query, standards, maxResults = 5 } = req.body;

    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const results = await queryVectorDatabase({
      query,
      topK: maxResults,
    });

    const filteredResults = standards
      ? results.filter((r) => standards.some((s: string) => r.metadata.standard.includes(s)))
      : results;

    const summary =
      filteredResults.length > 0
        ? `Found ${filteredResults.length} relevant compliance requirements from ${[...new Set(filteredResults.map((r) => r.metadata.standard))].join(', ')}.`
        : 'No relevant compliance requirements found.';

    res.status(200).json({
      success: true,
      data: {
        results: filteredResults.map((r) => ({
          content: r.content,
          standard: r.metadata.standard,
          relevance: 1 - r.distance,
          source: r.metadata.source,
        })),
        summary,
      },
    });
  } catch (error) {
    console.error('RAG query error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
