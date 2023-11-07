import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose, { Error } from 'mongoose'
import router from './router'
import AuthenticateUser from './middlewares/AuthenticateUser'

require('dotenv').config()
const app = express()

app.use(
    cors({
        credentials: true,
        origin: true,
    }),
)
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/user', AuthenticateUser)
app.use(router())

const PORT = 8030
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

const MONGO_URI = process.env.MONGO_URI
mongoose.Promise = Promise
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err: Error) => console.log(err))

process.env.TZ = 'Asia/Jakarta'
