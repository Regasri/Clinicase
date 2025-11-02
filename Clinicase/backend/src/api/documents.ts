import * as functions from '@google-cloud/functions-framework';
import { processDocument } from '../services/documentAI';
import { firestore, collections, pubsub, topics, storage } from '../services/firebase';
import { config, corsOptions } from '../config';
import { ProcessDocumentRequest, Document } from '../models/document';
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery();

functions.http('processDocument', async (req, res) => {
  res.set('Access-Control-Allow-Origin', corsOptions.origin);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { storageUrl, fileName, uploadedBy }: ProcessDocumentRequest = req.body;

    if (!storageUrl || !fileName) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Process document with Document AI
    const processed = await processDocument(storageUrl, fileName);

    // Save to Firestore
    const documentId = `doc_${Date.now()}`;
    const document: Document = {
      id: documentId,
      fileName,
      storageUrl,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      extractedText: processed.text,
      entities: processed.entities,
      tables: processed.tables,
      status: 'completed',
      metadata: {
        mimeType: 'application/pdf',
        size: 0,
      },
    };

    await firestore.collection(collections.documents).doc(documentId).set(document);

    // Log to BigQuery
    await saveToBigQuery({
      documentId,
      fileName,
      processedAt: new Date().toISOString(),
      confidence: processed.confidence,
    });

    // Publish event
    await pubsub.topic(topics.documentProcessed).publishMessage({
      json: {
        documentId,
        fileName,
        uploadedBy,
        timestamp: new Date().toISOString(),
      },
    });

    res.status(200).json({
      success: true,
      data: { documentId, ...processed },
    });
  } catch (error) {
    console.error('Document processing error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

async function saveToBigQuery(data: any): Promise<void> {
  try {
    await bigquery
      .dataset(config.bigQuery.datasetId)
      .table(config.bigQuery.tableId)
      .insert([data]);
  } catch (error) {
    console.error('BigQuery insert error:', error);
  }
}
