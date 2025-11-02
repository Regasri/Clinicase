#!/bin/bash

# Healthcare Test Case Generation - Backend Deployment Script
# Deploy all Cloud Functions to Google Cloud

set -e

echo "🚀 Deploying Healthcare Test Case Generation Backend..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "❌ .env file not found. Please create one from .env.example"
  exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Set common deploy flags
RUNTIME="nodejs18"
REGION="${GCP_LOCATION:-us-central1}"
SOURCE="."

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building TypeScript..."
npm run build

echo "📤 Deploying functions to region: $REGION"

# Document Processing
echo "Deploying processDocument..."
gcloud functions deploy processDocument \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point processDocument \
  --source $SOURCE \
  --env-vars-file .env

# Test Case Generation
echo "Deploying generateTestCases..."
gcloud functions deploy generateTestCases \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point generateTestCases \
  --source $SOURCE \
  --env-vars-file .env

# Compliance Analysis
echo "Deploying analyzeCompliance..."
gcloud functions deploy analyzeCompliance \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point analyzeCompliance \
  --source $SOURCE \
  --env-vars-file .env

# Export Test Cases
echo "Deploying exportTestCases..."
gcloud functions deploy exportTestCases \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point exportTestCases \
  --source $SOURCE \
  --env-vars-file .env

# Traceability Matrix
echo "Deploying getTraceabilityMatrix..."
gcloud functions deploy getTraceabilityMatrix \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point getTraceabilityMatrix \
  --source $SOURCE \
  --env-vars-file .env

# Query Compliance Context
echo "Deploying queryComplianceContext..."
gcloud functions deploy queryComplianceContext \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point queryComplianceContext \
  --source $SOURCE \
  --env-vars-file .env

# Jira Integration
echo "Deploying exportToJira..."
gcloud functions deploy exportToJira \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point exportToJira \
  --source $SOURCE \
  --env-vars-file .env

# Polarion Integration
echo "Deploying exportToPolarion..."
gcloud functions deploy exportToPolarion \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point exportToPolarion \
  --source $SOURCE \
  --env-vars-file .env

# Azure DevOps Integration
echo "Deploying exportToAzureDevOps..."
gcloud functions deploy exportToAzureDevOps \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point exportToAzureDevOps \
  --source $SOURCE \
  --env-vars-file .env

# Auth functions
echo "Deploying getUserProfile..."
gcloud functions deploy getUserProfile \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point getUserProfile \
  --source $SOURCE \
  --env-vars-file .env

echo "Deploying updateUserProfile..."
gcloud functions deploy updateUserProfile \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point updateUserProfile \
  --source $SOURCE \
  --env-vars-file .env

# Requirements functions
echo "Deploying createRequirement..."
gcloud functions deploy createRequirement \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point createRequirement \
  --source $SOURCE \
  --env-vars-file .env

echo "Deploying getRequirements..."
gcloud functions deploy getRequirements \
  --gen2 \
  --runtime $RUNTIME \
  --region $REGION \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point getRequirements \
  --source $SOURCE \
  --env-vars-file .env

echo "✅ All functions deployed successfully!"
echo ""
echo "📝 Function URLs:"
echo "https://$REGION-$GCP_PROJECT_ID.cloudfunctions.net/processDocument"
echo "https://$REGION-$GCP_PROJECT_ID.cloudfunctions.net/generateTestCases"
echo "https://$REGION-$GCP_PROJECT_ID.cloudfunctions.net/analyzeCompliance"
echo "https://$REGION-$GCP_PROJECT_ID.cloudfunctions.net/exportTestCases"
echo "https://$REGION-$GCP_PROJECT_ID.cloudfunctions.net/getTraceabilityMatrix"
echo "https://$REGION-$GCP_PROJECT_ID.cloudfunctions.net/queryComplianceContext"
echo "https://$REGION-$GCP_PROJECT_ID.cloudfunctions.net/exportToJira"
echo "https://$REGION-$GCP_PROJECT_ID.cloudfunctions.net/exportToPolarion"
echo "https://$REGION-$GCP_PROJECT_ID.cloudfunctions.net/exportToAzureDevOps"
echo ""
echo "Update your frontend .env with these URLs!"
