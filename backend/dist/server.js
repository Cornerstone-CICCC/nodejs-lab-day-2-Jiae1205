"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 4500);
const ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:4321";
const SESSION_NAME = process.env.SESSION_NAME || "session";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-key";
app.use((0, cors_1.default)({ origin: ORIGIN, credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_session_1.default)({
    name: SESSION_NAME,
    keys: [SESSION_SECRET],
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: false, // HTTPS면 true
    httpOnly: true
}));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/", user_routes_1.default);
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
