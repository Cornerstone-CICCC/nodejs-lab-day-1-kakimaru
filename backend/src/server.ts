import express, {Request, Response} from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes';
dotenv.config()

// create
const app = express()


// middleware
app.use(cors({
  origin: 'http://localhost:4321',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser(process.env.COOKIE_KEY))


// routes
app.use('/', userRouter)

// start
const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})