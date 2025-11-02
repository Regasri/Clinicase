import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import { PubSub } from '@google-cloud/pubsub';

export const firestore = new Firestore();
export const storage = new Storage();
export const pubsub = new PubSub();

export const collections = {
  documents: 'documents',
  testCases: 'test_cases',
  users: 'users',
  compliance: 'compliance_data',
  traceabilityMatrices: 'traceability_matrices',
  requirements: 'requirements',
};

export const topics = {
  documentProcessed: 'document-processed',
  testCaseGenerated: 'test-case-generated',
};
