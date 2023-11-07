import axios from 'axios'
import { Request, Response } from 'express'
import getCaptureRate from '../helpers/capture_rate'
import { MyPokemon } from '../models/MyPokemon'
import { validateToken } from '../helpers/jwt'

type TGetPokemonList = {
    count: any
    next: any
    previous: any
    results: {
        name: string
        url: string
    }[]
}

export const get_pokemons = async (req: Request, res: Response) => {
    const { limit, offset } = req.query

    let pokemons

    try {
        const getPokemon = await axios.get('https://pokeapi.co/api/v2/pokemon', {
            params: {
                limit,
                offset: Number(offset) > 629 ? 629 : offset,
            },
        })
        pokemons = getPokemon.data
    } catch (err: any) {
        const { status, data } = err.response
        return res.status(status).json({ message: data })
    }

    const { count, next, previous, results }: TGetPokemonList = pokemons

    const data = await Promise.all(
        results.map(async v => {
            const getPokemonIdFromUrl: string = v.url.slice(0, -1).split('/').pop()
            let isObtained: boolean = false

            if (req.cookies['authorization']) {
                const token = validateToken(req.cookies['authorization'])
                if (token) {
                    const checkIsObtained = await MyPokemon.findOne({ user_id: token.id, pokemon_id: Number(getPokemonIdFromUrl) })
                    if (checkIsObtained) isObtained = true
                }
            }

            return {
                id: Number(getPokemonIdFromUrl),
                name: v.name,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${getPokemonIdFromUrl}.svg`,
                url: v.url,
                isObtained,
            }
        }),
    )

    return res.json({ count, next: Number(offset) > 629 ? null : next, previous, data })
}

export const get_pokemon_detail = async (req: Request, res: Response) => {
    let pokemon: any | undefined,
        isObtained: boolean = false

    try {
        const getDetailPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`)
        pokemon = getDetailPokemon.data
    } catch (err: any) {
        const { status, data } = err.response
        return res.status(status).json({ message: data })
    }

    const capture_rate = getCaptureRate(pokemon.stats)

    if (req.cookies['authorization']) {
        const token = validateToken(req.cookies['authorization'])
        if (token) {
            const checkIsObtained = await MyPokemon.findOne({ user_id: token.id, pokemon_id: pokemon.id })
            if (checkIsObtained) isObtained = true
        }
    }

    return res.json({ isObtained, capture_rate, ...pokemon })
}
