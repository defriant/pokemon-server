"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../helpers/jwt");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Name is required' });
    if (!email)
        return res.status(400).json({ message: 'Email is required' });
    if (!password)
        return res.status(400).json({ message: 'Password is required' });
    const isEmailExist = await User_1.User.findOne({ email }).exec();
    if (isEmailExist)
        return res.status(400).json({ message: 'Email already exist' });
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const createUser = await User_1.User.create({
        name: name,
        email: email,
        password: hashedPassword,
        pokeball: {
            max: 10,
            refreshes: [],
        },
    });
    const user = {
        id: createUser.id,
        name: createUser.name,
        email: createUser.email,
    };
    res.cookie('authorization', (0, jwt_1.createUserToken)(user), {
        maxAge: 2592000000, // 30d
    });
    res.json({
        user,
        message: 'Registration successfull',
    });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email)
        return res.status(400).json({ message: 'Email is required' });
    if (!password)
        return res.status(400).json({ message: 'Password is required' });
    const user = await User_1.User.findOne({ email }).exec();
    if (!user)
        return res.status(400).json({ message: 'Invalid credential' });
    const matchPassword = await bcrypt_1.default.compare(password, user.password);
    if (!matchPassword)
        return res.status(400).json({ message: 'Invalid credential' });
    const data = {
        id: user.id,
        name: user.name,
        email: user.email,
    };
    res.cookie('authorization', (0, jwt_1.createUserToken)(data), {
        maxAge: 2592000000, // 30d
    });
    return res.json({ ...data });
};
exports.login = login;
//# sourceMappingURL=AuthContoller.js.map