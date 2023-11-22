import express from 'express'

import ApiError from '../errors/ApiError'
import user from '../models/user'
const router = express.Router()

import UserController from '../controllers/UsersConroller'

// Define routes
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

export default router;
