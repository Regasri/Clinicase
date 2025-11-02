import * as functions from '@google-cloud/functions-framework';
import { firestore, collections } from '../../services/firebase';
import { config, corsOptions } from '../../config';
import axios from 'axios';

functions.http('exportToJira', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { testCaseIds, projectKey } = req.body;

    if (!testCaseIds || !projectKey) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Fetch test cases
    const testCases = await Promise.all(
      testCaseIds.map((id: string) =>
        firestore.collection(collections.testCases).doc(id).get()
      )
    );

    const createdIssues = [];

    // Create Jira issues
    for (const doc of testCases) {
      const tc = doc.data();
      if (!tc) continue;

      const jiraIssue = {
        fields: {
          project: { key: projectKey },
          summary: tc.title,
          description: formatJiraDescription(tc),
          issuetype: { name: 'Test' },
          priority: { name: mapPriority(tc.priority) },
        },
      };

      const response = await axios.post(
        `${config.integrations.jira.baseUrl}/rest/api/3/issue`,
        jiraIssue,
        {
          auth: {
            username: config.integrations.jira.email,
            password: config.integrations.jira.apiToken,
          },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      createdIssues.push({
        testCaseId: tc.id,
        jiraKey: response.data.key,
        jiraId: response.data.id,
      });
    }

    res.status(200).json({
      success: true,
      data: { createdIssues },
    });
  } catch (error) {
    console.error('Jira export error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

function formatJiraDescription(tc: any): string {
  let desc = `*Description:* ${tc.description}\n\n`;
  desc += `*Preconditions:* ${tc.preconditions}\n\n`;
  desc += `*Test Steps:*\n`;
  (tc.steps || []).forEach((step: string, idx: number) => {
    desc += `${idx + 1}. ${step}\n`;
  });
  desc += `\n*Expected Results:* ${tc.expectedResults}\n\n`;
  if (tc.compliance && tc.compliance.length > 0) {
    desc += `*Compliance Standards:* ${tc.compliance.join(', ')}\n`;
  }
  return desc;
}

function mapPriority(priority: string): string {
  const mapping: Record<string, string> = {
    critical: 'Highest',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  return mapping[priority.toLowerCase()] || 'Medium';
}
