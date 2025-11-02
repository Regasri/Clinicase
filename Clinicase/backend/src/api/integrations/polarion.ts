import * as functions from '@google-cloud/functions-framework';
import { firestore, collections } from '../../services/firebase';
import { config, corsOptions } from '../../config';
import axios from 'axios';

functions.http('exportToPolarion', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { testCaseIds, projectId, spaceId } = req.body;

    if (!testCaseIds || !projectId || !spaceId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Fetch test cases
    const testCases = await Promise.all(
      testCaseIds.map((id: string) =>
        firestore.collection(collections.testCases).doc(id).get()
      )
    );

    const createdWorkItems = [];

    // Create Polarion work items
    for (const doc of testCases) {
      const tc = doc.data();
      if (!tc) continue;

      const workItem = {
        type: 'testcase',
        title: tc.title,
        description: tc.description,
        testSteps: {
          steps: (tc.steps || []).map((step: string, idx: number) => ({
            stepNumber: idx + 1,
            stepDescription: step,
            expectedResult: idx === tc.steps.length - 1 ? tc.expectedResults : '',
          })),
        },
        customFields: {
          priority: tc.priority,
          compliance: (tc.compliance || []).join(', '),
        },
      };

      const response = await axios.post(
        `${config.integrations.polarion.baseUrl}/rest/v1/projects/${projectId}/spaces/${spaceId}/workitems`,
        workItem,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.integrations.polarion.apiToken}`,
          },
        }
      );

      createdWorkItems.push({
        testCaseId: tc.id,
        polarionId: response.data.id,
      });
    }

    res.status(200).json({
      success: true,
      data: { createdWorkItems },
    });
  } catch (error) {
    console.error('Polarion export error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
