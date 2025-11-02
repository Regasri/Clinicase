import express from "express";
import cors from "cors";
import { authRouter } from "./api/auth";
import { documentsRouter } from "./api/documents";
import { requirementsRouter } from "./api/requirements";
import { testcasesRouter } from "./api/testcases";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/requirements", requirementsRouter);
app.use("/api/testcases", testcasesRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
