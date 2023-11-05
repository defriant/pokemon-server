import axios from 'axios'
import { Request, Response } from 'express'
import getCaptureRate from '../helpers/capture_rate'

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

    const data = results.map(v => {
        const getPokemonIdFromUrl = v.url.slice(0, -1).split('/').pop()

        return {
            name: v.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${getPokemonIdFromUrl}.svg`,
            url: v.url,
        }
    })

    return res.json({ count, next: Number(offset) > 629 ? null : next, previous, data })
}

export const get_pokemon_detail = async (req: Request, res: Response) => {
    let pokemon

    try {
        const getDetailPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`)
        pokemon = getDetailPokemon.data
    } catch (err: any) {
        const { status, data } = err.response
        return res.status(status).json({ message: data })
    }

    let capture_rate = getCaptureRate(pokemon.stats)

    return res.json({ capture_rate, ...pokemon })
}
