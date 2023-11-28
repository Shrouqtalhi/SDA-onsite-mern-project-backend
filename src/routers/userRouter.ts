import express from 'express'

import ApiError from '../errors/ApiError'
import user from '../models/user'
const router = express.Router()

import userController from '../controllers/usersController'

// Define routes
router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.post('/', userController.createUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export default router
