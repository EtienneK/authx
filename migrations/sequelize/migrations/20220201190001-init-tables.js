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

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { dialect } = queryInterface.queryGenerator

    const common = {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      data: {
        type: dialect === '​postgres' ? Sequelize.JSONB : Sequelize.JSON
      },
      expiresAt: {
        type: Sequelize.DATE(3)
      },
      consumedAt: {
        type: Sequelize.DATE(3)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE(3),
        defaultValue: dialect === 'sqlite' ? Sequelize.literal('current_timestamp') : Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE(3),
        defaultValue: dialect === 'sqlite' ? Sequelize.literal('current_timestamp') : Sequelize.fn('NOW')
      }
    }

    const promises = allModels.map((name) => {
      const schema = {
        ...common,
        ...grantableModels.includes(name)
          ? {
              grantId: { type: Sequelize.STRING(50), unique: true }
            }
          : undefined,
        ...name === 'DeviceCode'
          ? {
              userCode: { type: Sequelize.STRING(50), unique: true }
            }
          : undefined,
        ...name === 'Session'
          ? {
              uid: { type: Sequelize.STRING(50), unique: true }
            }
          : undefined,
        ...name === 'User'
          ? {
              username: { type: Sequelize.STRING(16), allowNull: false, unique: true },
              email: { type: Sequelize.STRING(255), allowNull: false, unique: true }
            }
          : undefined
      }

      return queryInterface.createTable(name, schema)
    })

    return Promise.all(promises)
  },
  down: (queryInterface) => Promise.all(allModels.map(name => queryInterface.dropTable(name)))
}
