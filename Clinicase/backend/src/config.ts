export const config = {
  projectId: process.env.GCP_PROJECT_ID || '',
  location: process.env.GCP_LOCATION || 'us-central1',
  
  documentAI: {
    processorId: process.env.DOCUMENT_AI_PROCESSOR_ID || '',
    location: process.env.DOCUMENT_AI_LOCATION || 'us',
  },
  
  vertexAI: {
    model: process.env.VERTEX_AI_MODEL || 'gemini-1.5-pro',
    location: process.env.VERTEX_AI_LOCATION || 'us-central1',
  },
  
  vectorDB: {
    indexEndpoint: process.env.VECTOR_DB_INDEX_ENDPOINT || '',
    deployedIndexId: process.env.VECTOR_DB_DEPLOYED_INDEX_ID || '',
  },
  
  bigQuery: {
    datasetId: process.env.BIGQUERY_DATASET_ID || 'healthcare_testing',
    tableId: process.env.BIGQUERY_TABLE_ID || 'test_cases',
  },
  
  storage: {
    bucketName: process.env.STORAGE_BUCKET_NAME || '',
  },
  
  pubsub: {
    topics: {
      documentProcessed: 'document-processed',
      testCaseGenerated: 'test-case-generated',
    },
  },
  
  integrations: {
    jira: {
      baseUrl: process.env.JIRA_BASE_URL || '',
      email: process.env.JIRA_EMAIL || '',
      apiToken: process.env.JIRA_API_TOKEN || '',
    },
    polarion: {
      baseUrl: process.env.POLARION_BASE_URL || '',
      apiToken: process.env.POLARION_API_TOKEN || '',
    },
    azureDevOps: {
      organization: process.env.AZURE_DEVOPS_ORG || '',
      personalAccessToken: process.env.AZURE_DEVOPS_PAT || '',
    },
  },
};

export const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'],
  credentials: true,
};
