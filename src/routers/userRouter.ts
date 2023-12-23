import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

import ApiError from '../errors/ApiError'
import User from '../models/user'
import {
  validateForgotPassword,
  validateResetPassword,
  validateUser,
  validateUserLogin,
} from '../middlewares/validateUser'
import {
  generateActivationToken,
  sendActivationEmail,
  sendForgotPasswordEmail,
} from '../util/email'
import { checkAuth } from '../middlewares/checkAuthor'

const router = express.Router()

// Register
router.post('/register', validateUser, async (req, res, next) => {
  const { firstName, lastName, email, password } = req.validatedUser

  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return next(ApiError.badRequest('Email Already Exists'))
    }

    const activationToken = generateActivationToken()
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      activationToken,
    })
    await newUser.save()

    await sendActivationEmail(email, activationToken)

    res.json({
      msg: 'User registered. Check your email to activate your account!',
      user: newUser,
    })
  } catch (error) {
    console.log('error:', error)
    next(ApiError.badRequest('Something went wrong'))
  }
})

// Reset Password
router.post('/reset-password', validateResetPassword, async (req, res) => {
  const password = req.resetPassword.password
  const forgotPasswordCode = req.resetPassword.forgotPasswordCode

  console.log(password)
  console.log(forgotPasswordCode)

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.findOne({ forgotPasswordCode })
  if (!user) {
    return res.json({ msg: 'Password did not reset' })
  }

  user.forgotPasswordCode = undefined
  user.password = hashedPassword
  await user.save()

  res.json({
    msg: 'Password is reset',
  })
})

// Forgot Password
router.post('/forgot-password', validateForgotPassword, async (req, res, next) => {
  const { email } = req.forgotPassword

  try {
    const userExists = await User.findOne({ email })
    if (!userExists || !userExists.isActive) {
      return next(ApiError.badRequest('Email does not exists or your email is not activated !'))
    }

    const forgotPasswordCode = generateActivationToken()
    await User.updateOne({ email }, { forgotPasswordCode })

    await sendForgotPasswordEmail(email, forgotPasswordCode)

    res.json({
      msg: 'Check your email to reset your password!',
    })
  } catch (error) {
    console.log('error:', error)
    next(ApiError.badRequest('Something went wrong'))
  }
})

// Activation Token
router.get('/activateUser/:activationToken', async (req, res, next) => {
  const activationToken = req.params.activationToken
  const user = await User.findOne({ activationToken })

  if (!user) {
    next(ApiError.badRequest('Invalid activation token'))
    return
  }

  user.isActive = true
  user.activationToken = undefined

  await user.save()

  res.status(200).json({
    msg: 'Account activated successfully',
  })
})

// Login
router.post('/login', validateUserLogin, async (req, res, next) => {
  const { email, password } = req.validateUserLogin
  const user = await User.findOne({ email })
  // we moved this check to be after comparing to avoid timing attack
  if (!user || !user.isActive) {
    next(ApiError.badRequest('Invalid email or account not activated'))
    return
  }
  const isPassValid = await bcrypt.compare(password, user.password)
  if (!isPassValid) {
    next(ApiError.badRequest('Invalid email or password'))
    return
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.TOKEN_SECRET as string,
    {
      expiresIn: '24h',
      algorithm: 'HS256',
    }
  )
  const userWithoutPass = await User.findOne({ email }).select('-password')

  res.status(200).json({ msg: 'Login successfully', token, user: userWithoutPass })
})

// Delete User
router.delete(
  '/:userId',
  /*checkAuth('ADMIN'),*/ async (req, res) => {
    console.log('👀 ', req.params.userId)
    await User.deleteOne({ _id: req.params.userId })
    res.send({
      msg: 'User has been deleted successfully',
    })
  }
)

// Get All Users
router.get(
  '/',
  /*checkAuth('ADMIN'),*/ async (req, res, next) => {
    const users = await User.find().select(['-password', '-activationToken'])
    res.json({
      users,
    })
  }
)

// Grant Role
router.put(
  '/role',
  /*checkAuth('ADMIN'),*/ async (req, res, next) => {
    const userId = req.body.userId
    const role = req.body.role
    const user = await User.findOneAndUpdate({ _id: userId }, { role }, { new: true }).select([
      '-password',
      '-activationToken',
    ])
    res.json({
      user,
    })
  }
)
export default router
