import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, role`,
      [email, hash, role || "user"]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "email already exists" });
    }
    res.status(500).json({ error: "registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ token });
  } catch {
    res.status(500).json({ error: "login failed" });
  }
};

export const me = async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      role: req.user.role,
    });
  } catch {
    res.status(500).json({ error: "failed to fetch user" });
  }
};
export const adminOnly = async (req, res) => {
  res.json({
    message: "Welcome admin, you have access",
  });
};