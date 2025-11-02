import * as functions from '@google-cloud/functions-framework';
import { firestore, collections } from '../../services/firebase';
import { config, corsOptions } from '../../config';
import axios from 'axios';

functions.http('exportToAzureDevOps', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { testCaseIds, project, areaPath, iterationPath } = req.body;

    if (!testCaseIds || !project) {
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

    // Create Azure DevOps work items
    for (const doc of testCases) {
      const tc = doc.data();
      if (!tc) continue;

      const workItem = [
        { op: 'add', path: '/fields/System.Title', value: tc.title },
        { op: 'add', path: '/fields/System.Description', value: tc.description },
        { op: 'add', path: '/fields/Microsoft.VSTS.TCM.Steps', value: formatSteps(tc) },
        { op: 'add', path: '/fields/Microsoft.VSTS.Common.Priority', value: getPriorityValue(tc.priority) },
      ];

      if (areaPath) {
        workItem.push({ op: 'add', path: '/fields/System.AreaPath', value: `${project}\\${areaPath}` });
      }

      if (iterationPath) {
        workItem.push({ op: 'add', path: '/fields/System.IterationPath', value: `${project}\\${iterationPath}` });
      }

      const response = await axios.post(
        `https://dev.azure.com/${config.integrations.azureDevOps.organization}/${project}/_apis/wit/workitems/$Test%20Case?api-version=7.0`,
        workItem,
        {
          headers: {
            'Content-Type': 'application/json-patch+json',
            Authorization: `Basic ${Buffer.from(`:${config.integrations.azureDevOps.personalAccessToken}`).toString('base64')}`,
          },
        }
      );

      createdWorkItems.push({
        testCaseId: tc.id,
        azureId: response.data.id,
        azureUrl: response.data._links.html.href,
      });
    }

    res.status(200).json({
      success: true,
      data: { createdWorkItems },
    });
  } catch (error) {
    console.error('Azure DevOps export error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

function formatSteps(tc: any): string {
  let stepsXml = '<steps>';
  (tc.steps || []).forEach((step: string, idx: number) => {
    stepsXml += `<step id="${idx + 1}"><parameterizedString isformatted="true">${step}</parameterizedString>`;
    if (idx === tc.steps.length - 1) {
      stepsXml += `<parameterizedString isformatted="true">${tc.expectedResults}</parameterizedString>`;
    } else {
      stepsXml += `<parameterizedString isformatted="true"></parameterizedString>`;
    }
    stepsXml += `<description/></step>`;
  });
  stepsXml += '</steps>';
  return stepsXml;
}

function getPriorityValue(priority: string): number {
  const mapping: Record<string, number> = {
    critical: 1,
    high: 2,
    medium: 3,
    low: 4,
  };
  return mapping[priority.toLowerCase()] || 3;
}
