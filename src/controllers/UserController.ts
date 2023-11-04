import { Request, Response } from 'express'
import { UserType } from 'models/User'

export const profile = (req: Request, res: Response) => {
    const { _id: id, name, email }: UserType = res.locals.user
    res.json({ id, name, email })
}
