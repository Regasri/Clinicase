import { Router } from "express";

export const testcasesRouter = Router();

testcasesRouter.post("/export", async (req, res) => {
  // Export test cases in requested format
  res.json({ message: "Test cases exported" });
});
