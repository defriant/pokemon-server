import mongoose from 'mongoose'

const MyPokemonSchema = new mongoose.Schema({
    pokemon_id: Number,
    user_id: String,
    name: String,
    image: String,
    captured_at: Number,
})

export const MyPokemon = mongoose.model('MyPokemon', MyPokemonSchema)

export type MyPokemonType = {
    _id: string
    pokemon_id: number
    user_id: string
    name: string
    image: string
    captured_at: number
}
