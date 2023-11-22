import 'dotenv/config'

export const dev = {
  app: {
    PORT: Number(process.env.PORT) || 5050,
  },
  db: {
    ATLAS_URL: process.env.ATLAS_URL,
  },
}
