"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.createUserToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const JWTSecret = 'qweasdzxc';
const createUserToken = (data) => {
    const token = (0, jsonwebtoken_1.sign)(data, JWTSecret, {
        expiresIn: '30d',
    });
    return token;
};
exports.createUserToken = createUserToken;
const validateToken = (token) => {
    try {
        const validate = (0, jsonwebtoken_1.verify)(token, JWTSecret);
        return validate;
    }
    catch (err) {
        return null;
    }
};
exports.validateToken = validateToken;
//# sourceMappingURL=jwt.js.map