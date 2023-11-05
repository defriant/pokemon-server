import { User } from '../models/User'

const getUserPokeball = async (_id: string) => {
    const user = await User.findOne({ _id }).exec()
    const refreshes = user.pokeball.refreshes.filter((refreshAt: number) => refreshAt > new Date().getTime())

    await User.findOne({ _id }).updateOne({
        pokeball: {
            max: user.pokeball.max,
            refreshes: refreshes,
        },
    })

    const current: number = user.pokeball.max - refreshes.length
    const max: number = user.pokeball.max

    return { current, max, refreshAfter: refreshes[0] ?? null }
}

export default getUserPokeball
