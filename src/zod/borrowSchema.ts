import { z } from 'zod'

export const borrowSchemam = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'user id is required !',
      invalid_type_error: 'user must be a string',
    }),
    bookId: z.string({
      required_error: 'book id is required !',
      invalid_type_error: 'book must be a string',
    }),
    nomberOfDays: z
      .number({
        required_error: 'number of days is required !',
        invalid_type_error: 'user must be a number',
      })
      .min(1, 'nomberOfDays must be at least 1'),
  }),
})
