import axios from 'axios'
import { Request, Response } from 'express'

export const get_pokemons = async (req: Request, res: Response) => {
    let pokemons

    try {
        const getPokemon = await axios.get('https://pokeapi.co/api/v2/pokemon', {
            params: req.query,
        })
        pokemons = getPokemon.data
    } catch (err: any) {
        const { status, data } = err.response

        res.status(status)
        res.json({ message: data })
    }

    res.json(pokemons)
}

export const get_pokemon_detail = async (req: Request, res: Response) => {
    let data

    try {
        const getDetailPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`)
        data = getDetailPokemon.data
    } catch (err: any) {
        const { status, data } = err.response

        res.status(status)
        res.json({ message: data })
    }

    res.json(data)
}
