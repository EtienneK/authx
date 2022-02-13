import { nanoid } from 'nanoid'
import adapters from '../../adapters'
import { User } from '../../schemas/shared/admin'
import { hashPassword } from '../../utils/crypto'

export async function upsert (user: User, id?: string): Promise<string> {
  const username = user.username.toLowerCase()
  const email = user.email.toLowerCase()

  const idToUpsert = id ?? nanoid()

  await adapters.users().upsert(idToUpsert, {
    ...user,
    username,
    email,
    password: await hashPassword(user.password)
  })

  return idToUpsert
}
