"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const hash_util_1 = require("../utils/hash.util");
// get users
const getUsers = (req, res) => {
    const users = user_model_1.default.findAll();
    res.json(users);
};
// get user by id
const getUserById = (req, res) => {
    const { id } = req.params;
    const user = user_model_1.default.findById(id);
    if (!user) {
        res.status(404).send(`User not found`);
        return;
    }
    res.json(user);
};
// get user by username
const getUserByUsername = (req, res) => {
    const { username } = req.params;
    const user = user_model_1.default.findByUsername(username);
    if (!user) {
        res.status(404).send(`User not found`);
        return;
    }
    res.json(user);
};
// create user
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstname, lastname } = req.body;
    const hashedPassword = yield (0, hash_util_1.hashed)(password);
    const user = user_model_1.default.create({
        username,
        password: hashedPassword,
        firstname,
        lastname,
    });
    res.status(201).json(user);
});
// update user
const updateUserById = (req, res) => {
    const { id } = req.params;
    const { username, password, firstname, lastname } = req.body;
    const user = user_model_1.default.update(id, {
        username,
        password,
        firstname,
        lastname,
    });
    if (!user) {
        res.status(404).send(`User not found`);
        return;
    }
    res.status(200).json(user);
};
// delete user
const deleteUserById = (req, res) => {
    const { id } = req.params;
    const isDeleted = user_model_1.default.delete(id);
    if (!isDeleted) {
        res.status(404).send(`User not found`);
        return;
    }
    res.status(200).send(`User deleted.`);
};
// login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = user_model_1.default.findByUsername(username);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const isMatch = yield (0, hash_util_1.compareHash)(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: "Password is invalid" });
        return;
    }
    res.cookie("isAuthenticated", true, {
        maxAge: 3 * 60 * 1000,
        signed: true,
        httpOnly: true,
    });
    res.cookie("userId", user.id, {
        maxAge: 3 * 60 * 1000,
        signed: true,
        httpOnly: true,
    });
    res.status(200).json({ message: "Login authenticated." });
});
// check auth
const userProfile = (req, res) => {
    res.status(200).send(`You are allowed to view the page.`);
};
// logout
const logoutUser = (req, res) => {
    res.clearCookie('isAuthenticated');
    res.clearCookie('userId');
    res.status(200).send({ message: "Logged out." });
};
exports.default = {
    getUsers,
    getUserById,
    getUserByUsername,
    addUser,
    updateUserById,
    deleteUserById,
    loginUser,
    userProfile,
    logoutUser,
};
