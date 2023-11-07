"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_my_pokemon_detail = exports.get_my_pokemons = exports.get_pokeball = exports.catch_pokemon = exports.profile = void 0;
const axios_1 = __importDefault(require("axios"));
const capture_rate_1 = __importDefault(require("../helpers/capture_rate"));
const User_1 = require("../models/User");
const rng_1 = __importDefault(require("../helpers/rng"));
const date_fns_1 = require("date-fns");
const pokeball_1 = __importDefault(require("../helpers/pokeball"));
const MyPokemon_1 = require("../models/MyPokemon");
const profile = async (req, res) => {
    const { _id: id, name, email } = res.locals.user;
    res.json({ id, name, email });
};
exports.profile = profile;
const catch_pokemon = async (req, res) => {
    const { _id: user_id } = res.locals.user;
    const { pokemon_id } = req.body;
    const user = await User_1.User.findOne({ _id: user_id }).exec();
    const pokeball = await (0, pokeball_1.default)(user_id);
    const isObtained = await MyPokemon_1.MyPokemon.findOne({ pokemon_id, user_id }).exec();
    if (isObtained)
        return res.status(400).json({ message: `You already obtained this pokemon` });
    if (pokeball.current === 0)
        return res.status(400).json({ message: `You don't have any pokeballs left, please wait until recharge` });
    let pokemon;
    try {
        const getDetailPokemon = await axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/${pokemon_id}`);
        pokemon = getDetailPokemon.data;
    }
    catch (err) {
        const { status, data } = err.response;
        return res.status(status).json({ message: data });
    }
    const capture_rate = (0, capture_rate_1.default)(pokemon.stats);
    const roll = (0, rng_1.default)(0, 100, 0);
    const refreshOneAfter = (0, date_fns_1.addMinutes)(user.pokeball.refreshes.length > 0 ? user.pokeball.refreshes[user.pokeball.refreshes.length - 1] : new Date().getTime(), 1).getTime();
    const refreshes = [...user.pokeball.refreshes];
    refreshes.push(refreshOneAfter);
    await User_1.User.findOne({ _id: user_id }).updateOne({
        pokeball: {
            max: user.pokeball.max,
            refreshes,
        },
    });
    if (roll <= capture_rate) {
        await MyPokemon_1.MyPokemon.create({
            pokemon_id: pokemon_id,
            user_id,
            name: pokemon.name,
            image: pokemon.sprites?.other?.dream_world?.front_default,
            captured_at: new Date().getTime(),
        });
        return res.json({
            isSuccess: true,
            capture_rate,
            roll,
        });
    }
    else {
        return res.json({
            isSuccess: false,
            capture_rate,
            roll,
        });
    }
};
exports.catch_pokemon = catch_pokemon;
const get_pokeball = async (req, res) => {
    const { _id } = res.locals.user;
    const pokeball = await (0, pokeball_1.default)(_id);
    return res.json(pokeball);
};
exports.get_pokeball = get_pokeball;
const get_my_pokemons = async (req, res) => {
    const { _id: user_id } = res.locals.user;
    const getMyPokemon = await MyPokemon_1.MyPokemon.find({ user_id }).exec();
    return res.json(getMyPokemon);
};
exports.get_my_pokemons = get_my_pokemons;
const get_my_pokemon_detail = async (req, res) => {
    const { _id: user_id } = res.locals.user;
    const { pokemon_name } = req.params;
    if (!pokemon_name)
        return res.status(404).json({ message: 'Not found' });
    const getMyPokemon = await MyPokemon_1.MyPokemon.findOne({ user_id, name: pokemon_name }).exec();
    if (getMyPokemon) {
        let pokemon, isObtained = true;
        try {
            const getDetailPokemon = await axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}`);
            pokemon = getDetailPokemon.data;
        }
        catch (err) {
            const { status, data } = err.response;
            return res.status(status).json({ message: data });
        }
        const capture_rate = (0, capture_rate_1.default)(pokemon.stats);
        return res.json({ isObtained, capture_rate, ...pokemon });
    }
    return res.status(404).json({ message: 'Not found' });
};
exports.get_my_pokemon_detail = get_my_pokemon_detail;
//# sourceMappingURL=UserController.js.map