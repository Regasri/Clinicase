import * as functions from '@google-cloud/functions-framework';
import { firestore, collections } from '../services/firebase';
import { corsOptions } from '../config';
import { Requirement } from '../models/requirement';

// Create requirement
functions.http('createRequirement', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const requirementData = req.body;

    const requirementId = `req_${Date.now()}`;
    const requirement: Requirement = {
      ...requirementData,
      id: requirementId,
      status: requirementData.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await firestore.collection(collections.requirements).doc(requirementId).set(requirement);

    res.status(200).json({
      success: true,
      data: requirement,
    });
  } catch (error) {
    console.error('Create requirement error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get requirements by project
functions.http('getRequirements', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { projectId } = req.query;

    if (!projectId) {
      res.status(400).json({ error: 'Project ID is required' });
      return;
    }

    const snapshot = await firestore
      .collection(collections.requirements)
      .where('projectId', '==', projectId)
      .get();

    const requirements = snapshot.docs.map((doc) => doc.data());

    res.status(200).json({
      success: true,
      data: requirements,
    });
  } catch (error) {
    console.error('Get requirements error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
