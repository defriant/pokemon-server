import { Router } from 'express'
import { get_pokemon_detail, get_pokemons } from './controllers/PokemonController'
import { login, register } from './controllers/AuthContoller'
import { catch_pokemon, get_pokeball, profile } from './controllers/UserController'

const Route = Router()

export default (): Router => {
    Route.get('/pokemons', get_pokemons)
    Route.get('/pokemons/:id', get_pokemon_detail)

    Route.post('/auth/register', register)
    Route.post('/auth/login', login)

    Route.get('/user/profile', profile)
    Route.post('/user/pokemon/catch', catch_pokemon)
    Route.get('/user/pokeball', get_pokeball)

    return Route
}
