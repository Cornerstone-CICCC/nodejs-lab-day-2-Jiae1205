"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.post("/signup", user_controller_1.addUser);
router.post("/login", user_controller_1.loginUser);
router.get("/logout", user_controller_1.logout);
router.get("/check-auth", user_controller_1.checkAuth);
// optional
router.get("/user/:username", user_controller_1.getUserByUsername);
exports.default = router;
