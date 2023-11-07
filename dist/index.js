"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const router_1 = __importDefault(require("./router"));
const AuthenticateUser_1 = __importDefault(require("./middlewares/AuthenticateUser"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: true,
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use('/user', AuthenticateUser_1.default);
app.use((0, router_1.default)());
const PORT = 8030;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const MONGO_URI = process.env.MONGO_URI;
mongoose_1.default.Promise = Promise;
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
process.env.TZ = 'Asia/Jakarta';
//# sourceMappingURL=index.js.map