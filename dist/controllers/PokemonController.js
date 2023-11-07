"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_pokemon_detail = exports.get_pokemons = void 0;
const axios_1 = __importDefault(require("axios"));
const capture_rate_1 = __importDefault(require("../helpers/capture_rate"));
const MyPokemon_1 = require("../models/MyPokemon");
const jwt_1 = require("../helpers/jwt");
const get_pokemons = async (req, res) => {
    const { limit, offset } = req.query;
    let pokemons;
    try {
        const getPokemon = await axios_1.default.get('https://pokeapi.co/api/v2/pokemon', {
            params: {
                limit,
                offset: Number(offset) > 629 ? 629 : offset,
            },
        });
        pokemons = getPokemon.data;
    }
    catch (err) {
        const { status, data } = err.response;
        return res.status(status).json({ message: data });
    }
    const { count, next, previous, results } = pokemons;
    const data = await Promise.all(results.map(async (v) => {
        const getPokemonIdFromUrl = v.url.slice(0, -1).split('/').pop();
        let isObtained = false;
        if (req.cookies['authorization']) {
            const token = (0, jwt_1.validateToken)(req.cookies['authorization']);
            if (token) {
                const checkIsObtained = await MyPokemon_1.MyPokemon.findOne({ user_id: token.id, pokemon_id: Number(getPokemonIdFromUrl) });
                if (checkIsObtained)
                    isObtained = true;
            }
        }
        return {
            id: Number(getPokemonIdFromUrl),
            name: v.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${getPokemonIdFromUrl}.svg`,
            url: v.url,
            isObtained,
        };
    }));
    return res.json({ count, next: Number(offset) > 629 ? null : next, previous, data });
};
exports.get_pokemons = get_pokemons;
const get_pokemon_detail = async (req, res) => {
    let pokemon, isObtained = false;
    try {
        const getDetailPokemon = await axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`);
        pokemon = getDetailPokemon.data;
    }
    catch (err) {
        const { status, data } = err.response;
        return res.status(status).json({ message: data });
    }
    const capture_rate = (0, capture_rate_1.default)(pokemon.stats);
    if (req.cookies['authorization']) {
        const token = (0, jwt_1.validateToken)(req.cookies['authorization']);
        if (token) {
            const checkIsObtained = await MyPokemon_1.MyPokemon.findOne({ user_id: token.id, pokemon_id: pokemon.id });
            if (checkIsObtained)
                isObtained = true;
        }
    }
    return res.json({ isObtained, capture_rate, ...pokemon });
};
exports.get_pokemon_detail = get_pokemon_detail;
//# sourceMappingURL=PokemonController.js.map