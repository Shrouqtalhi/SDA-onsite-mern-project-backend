import mongoose from 'mongoose'
import { dev } from '.'

export const connectDB = () => {
  mongoose
    .connect(dev.db.ATLAS_URL as string)
    .then(() => {
      console.log('Database connected')
    })
    .catch((err) => {})
}
