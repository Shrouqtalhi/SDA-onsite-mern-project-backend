import 'dotenv/config'

export const dev = {
  app: {
    PORT: Number(process.env.PORT) || 5000,
  },
  db: {
    ATLAS_URL: process.env.ATLAS_URL,
  },
}
