import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (two levels up from src/)
dotenv.config({ path: path.join(__dirname, "../../.env") });

import pkg from "pg";
const { Pool } = pkg;

console.log("DB URL in db.js:", process.env.DATABASE_URL);

// Detect if using Neon DB (requires SSL) or localhost (no SSL)
const isNeonDB = process.env.DATABASE_URL?.includes('neon.tech');
const isLocalhost = process.env.DATABASE_URL?.includes('localhost');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
});

export default pool;
