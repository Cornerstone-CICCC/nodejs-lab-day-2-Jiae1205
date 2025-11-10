import { Router } from "express";
import {
  addUser,
  loginUser,
  logout,
  checkAuth,
  getUserByUsername
} from "../controllers/user.controller";

const router = Router();

router.post("/signup", addUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/check-auth", checkAuth);

// optional
router.get("/user/:username", getUserByUsername);

export default router;
