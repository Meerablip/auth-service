import express from "express";
import pool from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../public")));

// health check
app.get("/", (req, res) => {
  res.json({
    service: "auth-service",
    status: "running",
  });
});

// db check (keep this, it's useful)
app.get("/db-check", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// auth routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
