import { Request, Response, NextFunction } from 'express'
import { validateToken } from '../helpers/jwt'
import { User, UserType } from '../models/User'

const AuthenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = validateToken(req.headers['authorization'])

    if (!token) return res.status(401).json({ message: 'Unauthenticated' })

    const user = await User.findOne({ _id: token.id }).exec()
    if (!user) return res.status(401).json({ message: 'Unauthenticated' })

    res.locals.user = user
    next()
}

export default AuthenticateUser
