import express, { Application, Request, Response } from 'express'
import mongoose from 'mongoose'
import { dev } from './config'

import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'
import authorsRouter from './routers/authorRouter'
import borrowsRouter from './routers/borrowRouter'
import bookRouter from './routers/bookRoutes'
import { connectDB } from './config/db'
import morgan from 'morgan'
import userRouter from './routers/userRouter'

const app: Application = express()
const PORT = dev.app.PORT
// const URL = dev.db.ATLAS_URL as string

app.use(myLogger)
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/authors', authorsRouter)
app.use('/api/books', bookRouter)
app.use('/api/borrows', borrowsRouter)
app.use('api/users', userRouter )

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'route not found',
  })
})

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`)
  connectDB()
})

app.use(apiErrorHandler)