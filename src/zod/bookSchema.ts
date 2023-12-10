import { z, TypeOf } from 'zod'

export const bookSchema = z.object({
  body: z.object({
    image: z.string({
      required_error: 'image is required !',
      invalid_type_error: 'image must be a string',
    }),
    title: z
      .string({
        required_error: 'Title is required !',
        invalid_type_error: 'Title must be a string',
      })
      .min(2, 'Title must be more than 2 char'),
    description: z.string({
      required_error: 'Description is required !',
      invalid_type_error: 'Description must be string',
    }),
    isAvailable: z.boolean({
      required_error: 'Availability is required !',
      invalid_type_error: 'Availability must be number',
    }),
    bookCopiesQty: z
      .number({
        required_error: 'Copy QTY is required !',
        invalid_type_error: 'Copy QTY must be number',
      })
      .min(0, 'Number should be more than zero'),
  }),
})

export type BookSchemaType = TypeOf<typeof bookSchema>['body']
