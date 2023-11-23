import { z } from 'zod'

export const bookSchemam = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required !',
        invalid_type_error: 'Title must be a string',
      })
      .min(2, 'Title must be more than 2 char')
      .max(15, 'Title must be less than 15 char'),
  }),
})
