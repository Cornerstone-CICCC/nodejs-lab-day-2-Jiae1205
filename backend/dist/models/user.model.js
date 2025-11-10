"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const users = [];
const toPublic = (u) => ({
    id: u.id,
    username: u.username,
    firstname: u.firstname,
    lastname: u.lastname
});
exports.UserModel = {
    findByUsername(username) {
        const u = users.find(x => x.username === username);
        return u ? toPublic(u) : null;
    },
    login(username, password) {
        const u = users.find(x => x.username === username);
        if (!u)
            return null;
        const ok = bcrypt_1.default.compareSync(password, u.password);
        return ok ? toPublic(u) : null;
    },
    create(newUser) {
        const exists = users.some(x => x.username === newUser.username);
        if (exists)
            throw new Error("USERNAME_TAKEN");
        const hashed = bcrypt_1.default.hashSync(newUser.password, 10);
        const user = {
            id: (0, uuid_1.v4)(),
            username: newUser.username,
            password: hashed,
            firstname: newUser.firstname,
            lastname: newUser.lastname
        };
        users.push(user);
        return toPublic(user);
    }
};
