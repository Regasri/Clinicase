import { Router } from "express";
export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  // Implement Firebase Auth logic here
  res.json({ message: "Login endpoint" });
});
