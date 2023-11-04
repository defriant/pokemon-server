import { Router } from 'express'
import {
    get_pokemon_detail,
    get_pokemons,
} from './controllers/PokemonController'
import { login, register } from './controllers/AuthContoller'
import { profile } from './controllers/UserController'

const router = Router()

export default (): Router => {
    router.get('/pokemons', get_pokemons)
    router.get('/pokemons/:id', get_pokemon_detail)

    router.post('/auth/register', register)
    router.get('/auth/login', login)

    router.post('/user/profile', profile)

    return router
}
