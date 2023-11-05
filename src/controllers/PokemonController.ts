import axios from 'axios'
import { Request, Response } from 'express'
import getCaptureRate from '../helpers/capture_rate'

export const get_pokemons = async (req: Request, res: Response) => {
    let pokemons

    try {
        const getPokemon = await axios.get('https://pokeapi.co/api/v2/pokemon', {
            params: req.query,
        })
        pokemons = getPokemon.data
    } catch (err: any) {
        const { status, data } = err.response
        return res.status(status).json({ message: data })
    }

    return res.json(pokemons)
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
