import { Router } from "express";
import { generateTestCasesWithGemini } from "../services/geminiLLM";

export const requirementsRouter = Router();

requirementsRouter.post("/generate", async (req, res) => {
  // Generate test cases from requirements
  res.json({ message: "Test cases generated" });
});
