import express, { Application } from 'express'
import mongoose from 'mongoose'

import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'
import authorsRouter from './routers/authorRouter'
import borrowsRouter from './routers/borrowRouter'
import bookRouter from './routers/bookRoutes'
import { dev } from './config'

const app: Application = express()
const PORT = dev.app.PORT
const URL = dev.db.ATLAS_URL as string

app.use(myLogger)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/authors', authorsRouter)
app.use('/api/books', bookRouter)
app.use('/api/borrows', borrowsRouter)

app.use(apiErrorHandler)

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
