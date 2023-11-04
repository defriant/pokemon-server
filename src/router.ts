import { Router } from 'express'
import {
    get_pokemon_detail,
    get_pokemons,
} from './controllers/PokemonController'
import { login, register } from './controllers/AuthContoller'
import { profile } from './controllers/UserController'

const Route = Router()

export default (): Router => {
    Route.get('/pokemons', get_pokemons)
    Route.get('/pokemons/:id', get_pokemon_detail)

    Route.post('/auth/register', register)
    Route.get('/auth/login', login)

    Route.post('/user/profile', profile)

    return Route
}
