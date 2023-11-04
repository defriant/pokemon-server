import { Request, Response } from 'express'
import { validateToken } from '../helpers/jwt'

export const profile = (req: Request, res: Response) => {
    const { token, _user } = req.body
    const validate = validateToken(token)

    return res.json(_user)
}
