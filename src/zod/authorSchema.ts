import { z } from 'zod'

export const authorSchemam = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Title is required !',
        invalid_type_error: 'Title must be a string',
      })
      .min(2, 'Title must be more than 2 char'),
  }),
})
