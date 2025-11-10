import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4500);
const ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:4321";
const SESSION_NAME = process.env.SESSION_NAME || "session";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-key";

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: SESSION_NAME,
    keys: [SESSION_SECRET],
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: false, // HTTPS면 true
    httpOnly: true
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
