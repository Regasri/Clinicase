export interface Document {
  id: string;
  fileName: string;
  storageUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  processedAt?: string;
  extractedText?: string;
  entities?: Array<{
    type: string;
    mentionText: string;
    confidence: number;
  }>;
  tables?: Array<{
    headerRows: number;
    bodyRows: number;
  }>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata?: {
    mimeType: string;
    size: number;
    pageCount?: number;
  };
}

export interface ProcessDocumentRequest {
  storageUrl: string;
  fileName: string;
  uploadedBy: string;
}

export interface DocumentProcessingResult {
  documentId: string;
  extractedText: string;
  entities: any[];
  tables: any[];
  confidence: number;
}
