const Sequelize = require('sequelize')

const db = new Sequelize(`postgres://localhost:5432/boilermaker`, {
  logging: false // true: log the events in the database
})

module.exports = db
