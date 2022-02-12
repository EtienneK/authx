import { DataTypes, ModelStatic, Options, Sequelize, Transaction } from 'sequelize'
import { Adapters, CrudAdapter, FindPayload, ListPayload, OidcAdapter, UserAdapter } from '..'
import { UserWithId } from '../../schemas/db'

const enableSqlLogging = process.env.DATABASE_LOGGING_ENABLED ?? 'false'

const env = process.env.NODE_ENV ?? 'development'
const dbUrl = process.env.DATABASE_URL ?? `sqlite:./.db/${env}.sqlite`

const options: Options = {
  logging: enableSqlLogging === 'true' ? console.log : false
}

if (dbUrl.startsWith('sqlite')) {
  // Read https://activesphere.com/blog/2018/12/24/understanding-sqlite-busy to understand below
  options.retry = { max: 5 }
  options.transactionType = Transaction.TYPES.IMMEDIATE
}

const sequelize = new Sequelize(dbUrl, options)

const grantableModels = [
  'AccessToken',
  'AuthorizationCode',
  'DeviceCode',
  'RefreshToken'
]

const oidcModels = [
  'Client',
  'ClientCredentials',
  'Grant',
  'InitialAccessToken',
  'Interaction',
  'PushedAuthorizationRequest',
  'RegistrationAccessToken',
  'ReplayDetection',
  'Session',
  ...grantableModels
]

const allModels = [
  ...oidcModels,
  'User'
]

const models = new Map<string, ModelStatic<any>>()

function modelFor (name: string): ModelStatic<any> {
  if (!allModels.includes(name)) throw new Error('Unknown model:' + name)

  let ret = models.get(name)
  if (ret == null) {
    ret = sequelize.define(name, {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      ...grantableModels.includes(name) ? { grantId: { type: DataTypes.STRING } } : undefined,
      ...name === 'DeviceCode' ? { userCode: { type: DataTypes.STRING } } : undefined,
      ...name === 'Session' ? { uid: { type: DataTypes.STRING } } : undefined,
      ...name === 'User'
        ? {
            username: { type: DataTypes.STRING(16) },
            email: { type: DataTypes.STRING(255) }
          }
        : undefined,
      data: { type: DataTypes.JSON },
      expiresAt: { type: DataTypes.DATE },
      consumedAt: { type: DataTypes.DATE }
    }, {
      freezeTableName: true
    })
    models.set(name, ret)
  }

  return ret
}

class SequelizeCrudAdapter<T extends FindPayload> implements CrudAdapter<T> {
  protected readonly model: ModelStatic<any>

  constructor (private readonly name: string) {
    this.model = modelFor(name)
  }

  private mapFound (found: any): T {
    return {
      id: found.id,
      ...found.data,
      ...found.consumedAt != null
        ? { consumed: true }
        : undefined
    }
  }

  async find (id: string): Promise<T | undefined> {
    const found = await this.model.findByPk(id)
    if (found == null) return undefined
    return this.mapFound(found)
  }

  async list (): Promise<ListPayload<T>> {
    const found = await this.model.findAll()
    const results = found.map(this.mapFound)
    return {
      results,
      total: results.length
    }
  }

  async upsert (id: string, payload: Omit<T, 'id'>, expiresIn?: number): Promise<void> {
    await this.model.upsert({
      id,
      data: payload,
      ...grantableModels.includes(this.model.name) && payload.grantId != null
        ? {
            grantId: payload.grantId
          }
        : undefined,
      ...this.model.name === 'DeviceCode' && payload.userCode != null
        ? {
            userCode: payload.userCode
          }
        : undefined,
      ...this.model.name === 'Session' && payload.uid != null
        ? {
            uid: payload.uid
          }
        : undefined,
      ...this.model.name === 'User'
        ? {
            username: payload.username,
            email: payload.email
          }
        : undefined,
      ...expiresIn != null ? { expiresAt: new Date(Date.now() + expiresIn * 1000) } : undefined
    })
  }

  async destroy (id: string): Promise<void> {
    await this.model.destroy({ where: { id } })
  }
}

export class SequelizeOidcAdapter<T extends FindPayload> extends SequelizeCrudAdapter<T> implements OidcAdapter<T> {
}

export class SequelizeUserAdapter extends SequelizeCrudAdapter<UserWithId> implements UserAdapter {
  constructor () {
    super('User')
  }

  async upsert (id: string, payload: Omit<UserWithId, 'id'>, expiresIn?: number): Promise<void> {
    await super.upsert(id, payload, expiresIn)
  }

  async existsByUsername (username: string): Promise<boolean> {
    return await this.model.count({ where: { username } }) > 0
  }

  async existsByEmail (email: string): Promise<boolean> {
    return await this.model.count({ where: { email } }) > 0
  }
}

export default class SequelizeAdapterFactory implements Adapters {
  userAdapter: UserAdapter | undefined
  oidcAdapters: Map<string, OidcAdapter<FindPayload>> = new Map()

  users (): UserAdapter {
    if (this.userAdapter == null) {
      this.userAdapter = new SequelizeUserAdapter()
    }
    return this.userAdapter
  }

  oidc <T extends FindPayload>(name: string): OidcAdapter<T> {
    if (this.oidcAdapters.get(name) == null) {
      this.oidcAdapters.set(name, new SequelizeOidcAdapter(name))
    }
    return this.oidcAdapters.get(name) as any // TODO: Remove this any
  }
}
