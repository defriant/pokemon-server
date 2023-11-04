import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

export const User = mongoose.model('users', UserSchema)

export type UserType = {
    _id: string
    name: string
    email: string
    password: string
}
