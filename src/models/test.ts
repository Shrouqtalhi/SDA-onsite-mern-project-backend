import mongoose, { Document } from 'mongoose'

export type TestDocument = Document & {
  name: string
  products: mongoose.Schema.Types.ObjectId[]
}

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },
})

const test = mongoose.model<TestDocument>('Testt', testSchema)
const newTest = async () => {
  const x = await test.find()
  console.log('x', x)
}
newTest()
export default test
