import mongoose from 'mongoose'

// export type UserDocument = Document & {
//   firstName: string
//   lastName: string
//   email: string
//   password: string
//   role: string
// }
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    enum:['Admin', 'Visitor'],
    type: String,
    required: true,
  },
  // relation between borrow and user should be many borrows to one user
  // here's 1to1 just for the demo
  borrow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrow',
  },
})

export default mongoose.model('User', userSchema)
