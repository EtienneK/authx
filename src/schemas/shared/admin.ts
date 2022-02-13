import { InferType, object, string } from 'yup'

export interface WithId {
  id: string
}

// User

export const userSchema = object({
  email: string().required().email().max(255),
  username: string().required().min(1).max(16)
    .matches(/^[a-zA-Z]+.*$/, 'username must start with a letter')
    .matches(/^[a-zA-Z0-9]+$/, 'username may only contain alphanumeric characters'),
  password: string().required().min(8)
})

export interface User extends InferType<typeof userSchema> {}
export interface UserWithId extends User, WithId {}
