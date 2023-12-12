import { z, TypeOf } from 'zod'

export const userSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Title is required !',
        invalid_type_error: 'Title must be a string',
      })
      .min(2, 'Title must be more than 2 char'),
    password: z
      .string({
        required_error: 'Password is required !',
        invalid_type_error: 'Password must be a string',
      })
      .min(2, 'Password must be more than 6 char'),
  }),
})

export type AuthorSchemaType = TypeOf<typeof userSchema>['body']
