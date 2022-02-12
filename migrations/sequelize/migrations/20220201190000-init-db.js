module.exports = {
  up: (queryInterface, Sequelize) => {
    const { dialect } = queryInterface.queryGenerator
    const promises = []

    if (dialect === 'sqlite') {
      promises.push(queryInterface.sequelize.query('PRAGMA journal_mode=WAL;'))
    }

    return Promise.all(promises)
  },
  down: (queryInterface) => {
    const { dialect } = queryInterface.queryGenerator
    const promises = []

    if (dialect === 'sqlite') {
      promises.push(queryInterface.sequelize.query('PRAGMA journal_mode=DELETE;'))
    }

    return Promise.all(promises)
  }
}
