# Healthcare Test Case Generation - Backend

Backend API built with Google Cloud Functions for automated test case generation using AI.

## Architecture

```
backend/
├── src/
│   ├── api/              # HTTP endpoint handlers
│   ├── services/         # Business logic services
│   ├── models/           # Data models and types
│   ├── utils/            # Utility functions
│   ├── config.ts         # Configuration
│   └── index.ts          # Main entry point
```

## Services

### Core Services
- **firebase.ts**: Firebase/Firestore initialization
- **documentAI.ts**: Document processing with Google Document AI
- **geminiLLM.ts**: AI-powered generation with Vertex AI Gemini
- **agentBuilder.ts**: Orchestration of test case generation workflow
- **rag.ts**: Retrieval-Augmented Generation for compliance context
- **export.ts**: Export test cases in multiple formats

### API Endpoints

#### Documents
- `POST /processDocument`: Process uploaded documents with Document AI

#### Test Cases
- `POST /generateTestCases`: Generate test cases using AI
- `POST /analyzeCompliance`: Analyze compliance of test cases
- `POST /exportTestCases`: Export test cases (JSON/CSV/XLSX/PDF)
- `POST /getTraceabilityMatrix`: Get requirement traceability matrix
- `POST /queryComplianceContext`: Query compliance requirements using RAG

#### Integrations
- `POST /exportToJira`: Export to Jira
- `POST /exportToPolarion`: Export to Polarion
- `POST /exportToAzureDevOps`: Export to Azure DevOps

#### Auth & Requirements
- `GET /getUserProfile`: Get user profile
- `POST /updateUserProfile`: Update user profile
- `POST /createRequirement`: Create requirement
- `GET /getRequirements`: Get project requirements

## Deployment

### Prerequisites
1. Google Cloud account with billing enabled
2. gcloud CLI installed
3. Node.js 18+ installed

### Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Deploy all functions:**
   ```bash
   # Process Document
   gcloud functions deploy processDocument \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --entry-point processDocument \
     --source . \
     --env-vars-file .env

   # Generate Test Cases
   gcloud functions deploy generateTestCases \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --entry-point generateTestCases \
     --source . \
     --env-vars-file .env

   # Analyze Compliance
   gcloud functions deploy analyzeCompliance \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --entry-point analyzeCompliance \
     --source . \
     --env-vars-file .env

   # Export Test Cases
   gcloud functions deploy exportTestCases \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --entry-point exportTestCases \
     --source . \
     --env-vars-file .env

   # Traceability Matrix
   gcloud functions deploy getTraceabilityMatrix \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --entry-point getTraceabilityMatrix \
     --source . \
     --env-vars-file .env

   # Query Compliance Context
   gcloud functions deploy queryComplianceContext \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --entry-point queryComplianceContext \
     --source . \
     --env-vars-file .env

   # Jira Integration
   gcloud functions deploy exportToJira \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --entry-point exportToJira \
     --source . \
     --env-vars-file .env

   # Polarion Integration
   gcloud functions deploy exportToPolarion \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --entry-point exportToPolarion \
     --source . \
     --env-vars-file .env

   # Azure DevOps Integration
   gcloud functions deploy exportToAzureDevOps \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --entry-point exportToAzureDevOps \
     --source . \
     --env-vars-file .env
   ```

## Testing

Test endpoints using curl:

```bash
# Test document processing
curl -X POST https://REGION-PROJECT_ID.cloudfunctions.net/processDocument \
  -H "Content-Type: application/json" \
  -d '{"storageUrl": "gs://bucket/file.pdf", "fileName": "file.pdf", "uploadedBy": "user123"}'

# Test test case generation
curl -X POST https://REGION-PROJECT_ID.cloudfunctions.net/generateTestCases \
  -H "Content-Type: application/json" \
  -d '{"requirements": "User login", "complianceStandards": ["FDA 21 CFR Part 11"], "projectId": "proj123", "userId": "user123"}'
```

## Environment Variables

See `.env.example` for all required environment variables.

## Cost Optimization

- Use Firestore wisely (minimize reads/writes)
- Cache frequently accessed data
- Set appropriate function timeouts
- Use Cloud Functions v2 for better cold starts
- Monitor usage in Cloud Console

## Security

- Never commit `.env` file
- Use Secret Manager for sensitive data in production
- Implement proper authentication/authorization
- Validate all inputs
- Enable CORS appropriately
