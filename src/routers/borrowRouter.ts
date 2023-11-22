import express from 'express'
const router = express.Router()

import Borrow from '../models/borrow'

router.get('/', async (req, res) => {
  const borrows = await Borrow.find()

  console.log('borrows :>> ', borrows)
  res.status(200).json(borrows)
})

export default router
