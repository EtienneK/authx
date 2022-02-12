module.exports = {
  development: {
    storage: './.db/development.sqlite',
    dialect: 'sqlite',
    logging: true
    // migrationStorageTableName: 'SequelizeMeta'
  },
  test: {
    storage: './.db/main.sqlite',
    dialect: 'sqlite',
    logging: true
  },
  production: {
    username: '',
    password: '',
    database: '',
    host: '',
    dialect: 'postgres'
  }
}
