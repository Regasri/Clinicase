import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { storage } from './firebase';
import { config } from '../config';

const client = new DocumentProcessorServiceClient();

export interface ProcessedDocument {
  text: string;
  entities: Array<{
    type: string;
    mentionText: string;
    confidence: number;
  }>;
  tables: Array<{
    headerRows: number;
    bodyRows: number;
  }>;
  confidence: number;
}

export async function processDocument(
  storageUrl: string,
  fileName: string
): Promise<ProcessedDocument> {
  // Download file from storage
  const bucketName = storageUrl.split('/')[2];
  const filePath = storageUrl.split('/').slice(3).join('/');
  const [fileBuffer] = await storage.bucket(bucketName).file(filePath).download();

  // Process with Document AI
  const name = `projects/${config.projectId}/locations/${config.documentAI.location}/processors/${config.documentAI.processorId}`;

  const request = {
    name,
    rawDocument: {
      content: fileBuffer.toString('base64'),
      mimeType: getMimeType(fileName),
    },
  };

  const [result] = await client.processDocument(request);
  const { document } = result;

  if (!document) {
    throw new Error('No document returned from Document AI');
  }

  // Extract text
  const text = document.text || '';

  // Extract entities
  const entities = (document.entities || []).map((entity) => ({
    type: entity.type || 'unknown',
    mentionText: entity.mentionText || '',
    confidence: entity.confidence || 0,
  }));

  // Extract tables
  const tables = (document.pages || [])
    .flatMap((page) => page.tables || [])
    .map((table) => ({
      headerRows: table.headerRows?.length || 0,
      bodyRows: table.bodyRows?.length || 0,
    }));

  const confidence = calculateAverageConfidence(entities);

  return { text, entities, tables, confidence };
}

function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    tiff: 'image/tiff',
    gif: 'image/gif',
  };
  return mimeTypes[ext || ''] || 'application/pdf';
}

function calculateAverageConfidence(
  entities: Array<{ confidence: number }>
): number {
  if (entities.length === 0) return 0;
  const sum = entities.reduce((acc, entity) => acc + entity.confidence, 0);
  return sum / entities.length;
}
