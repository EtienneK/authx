import { object } from 'yup'
import adapters from '../../adapters'
import { userSchema } from '../shared/admin'

export interface WithId {
  id: string
}

// User

export const serverUserSchema = userSchema.concat(object({
  email: userSchema.fields.email.test(
    'unique email',
    'email already exists',
    async (email) => {
      if (email == null) return true
      const emailExists = await adapters.users().existsByEmail(email.toLowerCase())
      return !emailExists
    }),
  username: userSchema.fields.username.test(
    'unique username',
    'username already exists',
    async (username) => {
      if (username == null) return true
      const usernameExists = await adapters.users().existsByUsername(username.toLowerCase())
      return !usernameExists
    })
}))
