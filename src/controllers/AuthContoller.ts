import { Request, Response } from 'express'
import { User } from '../models/User'
import bcrypt from 'bcrypt'
import { createUserToken } from '../helpers/jwt'

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    if (!name) return res.status(400).json({ message: 'Name is required' })
    if (!email) return res.status(400).json({ message: 'Email is required' })
    if (!password) return res.status(400).json({ message: 'Password is required' })

    const isEmailExist = await User.findOne({ email }).exec()
    if (isEmailExist) return res.status(400).json({ message: 'Email already exist' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const createUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        pokeball: {
            max: 10,
            refreshes: [],
        },
    })

    const user = {
        id: createUser.id,
        name: createUser.name,
        email: createUser.email,
    }

    const token = createUserToken(user)

    res.json({
        user,
        message: 'Registration successfull',
        session: {
            token,
            maxAge: 2592000000,
        },
    })
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email) return res.status(400).json({ message: 'Email is required' })
    if (!password) return res.status(400).json({ message: 'Password is required' })

    const user = await User.findOne({ email }).exec()
    if (!user) return res.status(400).json({ message: 'Invalid credential' })

    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) return res.status(400).json({ message: 'Invalid credential' })

    const data = {
        id: user.id,
        name: user.name,
        email: user.email,
    }

    const token = createUserToken(data)
    return res.json({
        user: data,
        session: {
            token,
            maxAge: 2592000000,
        },
    })
}
