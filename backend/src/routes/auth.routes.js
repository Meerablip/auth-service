import { Router } from "express";
import { register, login, me, adminOnly } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, me);

// admin-only route
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminOnly
);

export default router;
