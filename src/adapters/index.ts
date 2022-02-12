import { UserWithId } from '../schemas/db'
import SequelizeAdapterFactory from './sequelize'

export interface FindPayload {
  id: string
  [key: string]: any
}

export interface ListPayload<T extends FindPayload> {
  results: T[]
  total: number
}

export interface CrudAdapter<T extends FindPayload> {
  find: (id: string) => Promise<T | undefined>
  list: () => Promise<ListPayload<T>>
  upsert: (id: string, payload: Omit<T, 'id'>, expiresIn?: number) => Promise<void>
  destroy: (id: string) => Promise<void>
}

export interface UserAdapter extends CrudAdapter<UserWithId> {
  existsByUsername: (username: string) => Promise<boolean>
  existsByEmail: (email: string) => Promise<boolean>
}

export interface OidcAdapter<T extends FindPayload> extends CrudAdapter<T> {
}

export interface Adapters {
  users: () => UserAdapter
  oidc: <T extends FindPayload>(name: string) => OidcAdapter<T>
}

const adapters = new SequelizeAdapterFactory() // TODO: Make configurable

export default adapters
