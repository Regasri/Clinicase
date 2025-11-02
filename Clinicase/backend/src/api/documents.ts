import { Router } from "express";
import { uploadToFirebase, saveDocMetadata } from "../services/firebase";
import { parseDocumentWithVertexAI } from "../services/documentAI";

export const documentsRouter = Router();

documentsRouter.post("/upload", async (req, res) => {
  // Upload file to Firebase Storage
  // Save metadata to Firestore
  res.json({ message: "File uploaded" });
});

documentsRouter.post("/parse", async (req, res) => {
  // Parse file with Vertex AI Document AI
  res.json({ message: "Document parsed" });
});
