import * as functions from '@google-cloud/functions-framework';
import { firestore, collections } from '../services/firebase';
import { corsOptions } from '../config';

// User profile management
functions.http('getUserProfile', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const userDoc = await firestore.collection(collections.users).doc(userId as string).get();

    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: userDoc.data(),
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

functions.http('updateUserProfile', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { userId, ...profileData } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    await firestore.collection(collections.users).doc(userId).set(
      {
        ...profileData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
