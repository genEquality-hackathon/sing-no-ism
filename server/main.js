const app = require('./index')
const PORT = process.env.PORT || 4321 // this can be very useful if you deploy to Heroku!
const { db } = require('./db/index')

db.sync(
  // { force: true } //drop all the tables
).then(() => {
  console.log('db synced')
  app.listen(PORT, () => console.log(`listening on port ${PORT}`))
})

