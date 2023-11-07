"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PokemonController_1 = require("./controllers/PokemonController");
const AuthContoller_1 = require("./controllers/AuthContoller");
const UserController_1 = require("./controllers/UserController");
const Route = (0, express_1.Router)();
exports.default = () => {
    Route.get('/pokemons', PokemonController_1.get_pokemons);
    Route.get('/pokemons/:id', PokemonController_1.get_pokemon_detail);
    Route.post('/auth/register', AuthContoller_1.register);
    Route.post('/auth/login', AuthContoller_1.login);
    Route.get('/user/profile', UserController_1.profile);
    Route.post('/user/pokemon/catch', UserController_1.catch_pokemon);
    Route.get('/user/pokeball', UserController_1.get_pokeball);
    Route.get('/user/my-pokemons', UserController_1.get_my_pokemons);
    Route.get('/user/my-pokemons/:pokemon_name', UserController_1.get_my_pokemon_detail);
    return Route;
};
//# sourceMappingURL=router.js.map