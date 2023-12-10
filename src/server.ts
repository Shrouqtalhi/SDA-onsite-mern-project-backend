import express, { Application, Request, Response } from 'express'
import { dev } from './config'
import cors from 'cors'
import apiErrorHandler from './middlewares/errorHandler'
import authorsRouter from './routers/authorRouter'
import borrowsRouter from './routers/borrowRouter'
import bookRouter from './routers/bookRoutes'
import { connectDB } from './config/db'
import morgan from 'morgan'
import userRouter from './routers/userRouter'
import mongoose from 'mongoose'

const app: Application = express()
const PORT = dev.app.PORT
const URL = process.env.ATLAS_URL as string
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.json({
    msg: 'Welcome',
  })
})

app.use('/api/authors', authorsRouter)
app.use('/api/books', bookRouter)
app.use('/api/borrows', borrowsRouter)
app.use('/api/users', userRouter)

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'route not found',
  })
})

// connectDB()

mongoose
  .connect(URL)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log('MongoDB connection error, ', err)
  })

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`)
})

app.use(apiErrorHandler)

export default app
