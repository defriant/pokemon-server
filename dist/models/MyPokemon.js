"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyPokemon = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MyPokemonSchema = new mongoose_1.default.Schema({
    pokemon_id: Number,
    user_id: String,
    name: String,
    image: String,
    captured_at: Number,
});
exports.MyPokemon = mongoose_1.default.model('MyPokemon', MyPokemonSchema);
//# sourceMappingURL=MyPokemon.js.map