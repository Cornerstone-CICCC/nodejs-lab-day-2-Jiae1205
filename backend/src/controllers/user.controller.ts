import type { Request, Response } from "express";
import { UserModel } from "../models/user.model";

export function getUserByUsername(req: Request, res: Response) {
  const username = (req.params.username || req.query.username) as string | undefined;
  if (!username) return res.status(400).json({ ok: false, error: "MISSING_USERNAME" });
  const user = UserModel.findByUsername(username);
  if (!user) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
  res.json({ ok: true, user });
}

export function loginUser(req: Request, res: Response) {
  const { username, password } = req.body ?? {};
  if (!username || !password) return res.status(400).json({ ok: false, error: "MISSING_FIELDS" });
  const user = UserModel.login(username, password);
  if (!user) return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
  (req as any).session = { username: user.username };
  res.json({ ok: true, user });
}

export function addUser(req: Request, res: Response) {
  const { username, password, firstname, lastname } = req.body ?? {};
  if (!username || !password || !firstname || !lastname) {
    return res.status(400).json({ ok: false, error: "MISSING_FIELDS" });
  }
  try {
    const user = UserModel.create({ username, password, firstname, lastname });
    (req as any).session = { username: user.username }; // auto-login
    res.status(201).json({ ok: true, user });
  } catch (err: any) {
    if (err?.message === "USERNAME_TAKEN") {
      return res.status(409).json({ ok: false, error: "USERNAME_TAKEN" });
    }
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
}

export function logout(req: Request, res: Response) {
  (req as any).session = null;
  res.json({ ok: true });
}

export function checkAuth(req: Request, res: Response) {
  const sess = (req as any).session as { username?: string } | null | undefined;
  const username = sess?.username;
  if (!username) return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
  const user = UserModel.findByUsername(username);
  if (!user) return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
  res.json({ ok: true, user });
}
