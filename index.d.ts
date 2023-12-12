declare namespace Express {
  interface Request {
    validatedUser: {
      firstName: string
      lastName: string
      email: string
      password: string
    }
    validateUserLogin: {
      email: string
      password: string
    }
    decodedUser: {
      userId: string
      email: string
      role: 'USER' | 'ADMIN'
      iat: number
      exp: number
    }
  }
}
