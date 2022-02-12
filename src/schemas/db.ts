import { InferType, object, string } from 'yup'

export interface WithId {
  id: string
}

// User

export const userSchema = object({
  email: string().required().email(),
  username: string().required()
})

export interface User extends InferType<typeof userSchema> {}
export interface UserWithId extends User, WithId {}
