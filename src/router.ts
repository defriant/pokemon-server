import { Router } from 'express'
import { get_pokemon_detail, get_pokemons } from './controllers/PokemonController'
import { login, register } from './controllers/AuthContoller'
import { profile } from './controllers/UserController'
import { Request, Response, NextFunction } from 'express'

const router = Router()

export default (): Router => {
    router.get('/pokemons', get_pokemons)
    router.get('/pokemons/:id', get_pokemon_detail)

    router.post('/auth/register', register)
    router.get('/auth/login', login)

    router.post(
        '/user/profile',
        (req: Request, res, next: NextFunction) => {
            req.body._user = {
                name: 'Afif',
            }

            next()
        },
        profile
    )

    return router
}
