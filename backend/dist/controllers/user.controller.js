"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUsername = getUserByUsername;
exports.loginUser = loginUser;
exports.addUser = addUser;
exports.logout = logout;
exports.checkAuth = checkAuth;
const user_model_1 = require("../models/user.model");
function getUserByUsername(req, res) {
    const username = (req.params.username || req.query.username);
    if (!username)
        return res.status(400).json({ ok: false, error: "MISSING_USERNAME" });
    const user = user_model_1.UserModel.findByUsername(username);
    if (!user)
        return res.status(404).json({ ok: false, error: "NOT_FOUND" });
    res.json({ ok: true, user });
}
function loginUser(req, res) {
    var _a;
    const { username, password } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (!username || !password)
        return res.status(400).json({ ok: false, error: "MISSING_FIELDS" });
    const user = user_model_1.UserModel.login(username, password);
    if (!user)
        return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
    req.session = { username: user.username };
    res.json({ ok: true, user });
}
function addUser(req, res) {
    var _a;
    const { username, password, firstname, lastname } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (!username || !password || !firstname || !lastname) {
        return res.status(400).json({ ok: false, error: "MISSING_FIELDS" });
    }
    try {
        const user = user_model_1.UserModel.create({ username, password, firstname, lastname });
        req.session = { username: user.username }; // auto-login
        res.status(201).json({ ok: true, user });
    }
    catch (err) {
        if ((err === null || err === void 0 ? void 0 : err.message) === "USERNAME_TAKEN") {
            return res.status(409).json({ ok: false, error: "USERNAME_TAKEN" });
        }
        res.status(500).json({ ok: false, error: "SERVER_ERROR" });
    }
}
function logout(req, res) {
    req.session = null;
    res.json({ ok: true });
}
function checkAuth(req, res) {
    const sess = req.session;
    const username = sess === null || sess === void 0 ? void 0 : sess.username;
    if (!username)
        return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
    const user = user_model_1.UserModel.findByUsername(username);
    if (!user)
        return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
    res.json({ ok: true, user });
}
