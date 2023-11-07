import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose, { Error } from 'mongoose'
import router from './router'
import AuthenticateUser from './middlewares/AuthenticateUser'

const app = express()

// app.use(
//     cors({
//         credentials: true,
//         origin: 'http://localhost:3030',
//     }),
// )
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/user', AuthenticateUser)
app.use(router())

const PORT = 8030
const server = http.createServer(app)
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

const MONGO_URL = 'mongodb+srv://pokeapp:L0QO1oFJg90cQscB@cluster0.ppg39mr.mongodb.net/pokemon_api?retryWrites=true&w=majority'
mongoose.Promise = Promise
mongoose
    .connect(MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((err: Error) => console.log(err))

process.env.TZ = 'Asia/Jakarta'
