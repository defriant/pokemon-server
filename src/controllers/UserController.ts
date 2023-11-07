import axios from 'axios'
import { Request, Response } from 'express'
import getCaptureRate from '../helpers/capture_rate'
import { User, UserType } from '../models/User'
import rng from '../helpers/rng'
import { addMinutes } from 'date-fns'
import getUserPokeball from '../helpers/pokeball'
import { MyPokemon } from '../models/MyPokemon'

export const profile = async (req: Request, res: Response) => {
    const { _id: id, name, email }: UserType = res.locals.user
    res.json({ id, name, email })
}

export const catch_pokemon = async (req: Request, res: Response) => {
    const { _id: user_id }: UserType = res.locals.user
    const { pokemon_id } = req.body
    const user = await User.findOne({ _id: user_id }).exec()
    const pokeball = await getUserPokeball(user_id)

    const isObtained = await MyPokemon.findOne({ pokemon_id, user_id }).exec()
    if (isObtained) return res.status(400).json({ message: `You already obtained this pokemon` })
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

    const refreshOneAfter = addMinutes(
        user.pokeball.refreshes.length > 0 ? user.pokeball.refreshes[user.pokeball.refreshes.length - 1] : new Date().getTime(),
        1,
    ).getTime()
    const refreshes = [...user.pokeball.refreshes]
    refreshes.push(refreshOneAfter)

    await User.findOne({ _id: user_id }).updateOne({
        pokeball: {
            max: user.pokeball.max,
            refreshes,
        },
    })

    if (roll <= capture_rate) {
        await MyPokemon.create({
            pokemon_id: pokemon_id,
            user_id,
            name: pokemon.name,
            image: pokemon.sprites?.other?.dream_world?.front_default,
            captured_at: new Date().getTime(),
        })

        return res.json({
            isSuccess: true,
            capture_rate,
            roll,
        })
    } else {
        return res.json({
            isSuccess: false,
            capture_rate,
            roll,
        })
    }
}

export const get_pokeball = async (req: Request, res: Response) => {
    const { _id }: UserType = res.locals.user
    const pokeball = await getUserPokeball(_id)

    return res.json(pokeball)
}

export const get_my_pokemons = async (req: Request, res: Response) => {
    const { _id: user_id }: UserType = res.locals.user

    const getMyPokemon = await MyPokemon.find({ user_id }).exec()

    return res.json(getMyPokemon)
}

export const get_my_pokemon_detail = async (req: Request, res: Response) => {
    const { _id: user_id }: UserType = res.locals.user
    const { pokemon_name } = req.params

    if (!pokemon_name) return res.status(404).json({ message: 'Not found' })

    const getMyPokemon = await MyPokemon.findOne({ user_id, name: pokemon_name }).exec()
    if (getMyPokemon) {
        let pokemon: any | undefined,
            isObtained: boolean = true

        try {
            const getDetailPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}`)
            pokemon = getDetailPokemon.data
        } catch (err: any) {
            const { status, data } = err.response
            return res.status(status).json({ message: data })
        }

        const capture_rate = getCaptureRate(pokemon.stats)
        return res.json({ isObtained, capture_rate, ...pokemon })
    }

    return res.status(404).json({ message: 'Not found' })
}
