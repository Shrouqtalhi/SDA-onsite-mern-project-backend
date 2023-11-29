import { z, TypeOf } from 'zod'

export const authorSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Title is required !',
        invalid_type_error: 'Title must be a string',
      })
      .min(2, 'Title must be more than 2 char'),
  }),
})

export type AuthorSchemaType = TypeOf<typeof authorSchema>['body']
