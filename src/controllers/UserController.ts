import axios from 'axios'
import { Request, Response } from 'express'
import getCaptureRate from '../helpers/capture_rate'
import { User, UserType } from '../models/User'
import rng from '../helpers/rng'
import { addMinutes } from 'date-fns'
import getUserPokeball from '../helpers/pokeball'

export const profile = async (req: Request, res: Response) => {
    const { _id: id, name, email }: UserType = res.locals.user
    res.json({ id, name, email })
}

export const catch_pokemon = async (req: Request, res: Response) => {
    const { _id }: UserType = res.locals.user
    const { pokemon_id } = req.body
    const user = await User.findOne({ _id }).exec()
    const pokeball = await getUserPokeball(_id)

    if (pokeball.current === 0) return res.status(400).json({ message: `You don't have any pokeballs left, please wait until recharge` })

    let pokemon
    try {
        const getDetailPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon_id}`)
        pokemon = getDetailPokemon.data
    } catch (err: any) {
        const { status, data } = err.response
        return res.status(status).json({ message: data })
    }

    const capture_rate = getCaptureRate(pokemon.stats)
    const roll = rng(0, 100, 0)

    const refreshOneAfter = addMinutes(pokeball.refreshAfter ?? new Date().getTime(), 1).getTime()
    const refreshes = [...user.pokeball.refreshes]
    refreshes.push(refreshOneAfter)

    await User.findOne({ _id }).updateOne({
        pokeball: {
            max: user.pokeball.max,
            refreshes,
        },
    })

    return res.json({ capture_rate, roll })
}

export const get_pokeball = async (req: Request, res: Response) => {
    const { _id }: UserType = res.locals.user
    const pokeball = await getUserPokeball(_id)

    return res.json(pokeball)
}
