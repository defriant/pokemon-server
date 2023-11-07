"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../helpers/jwt");
const User_1 = require("../models/User");
const AuthenticateUser = async (req, res, next) => {
    const token = (0, jwt_1.validateToken)(req.headers['authorization']);
    if (!token)
        return res.status(401).json({ message: 'Unauthenticated' });
    const user = await User_1.User.findOne({ _id: token.id }).exec();
    if (!user)
        return res.status(401).json({ message: 'Unauthenticated' });
    res.locals.user = user;
    next();
};
exports.default = AuthenticateUser;
//# sourceMappingURL=AuthenticateUser.js.map