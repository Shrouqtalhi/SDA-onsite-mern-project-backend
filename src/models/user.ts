import mongoose from 'mongoose'
export type DecodedUser = {
  userId: string
  email: string
  role: Role
  iat: number
  exp: number
}



function validateRole(role: string) {
  if (role === 'USER' || role === 'ADMIN') {
    return true
  }
  return false
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  activationToken: {
    type: String,
  },
  role: {
    type: String,
    default: 'USER',
    validate: [validateRole, 'Role has to be either USER or ADMIN'],
  },
})
export type Role = 'USER' | 'ADMIN'
export default mongoose.model('Client', userSchema)