import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    pokeball: {
        max: Number,
        refreshes: Array,
    },
})

export const User = mongoose.model('users', UserSchema)

export type UserType = {
    _id: string
    name: string
    email: string
    password: string
    pokeball: {
        max: number
        refreshes: number[]
    }
}
