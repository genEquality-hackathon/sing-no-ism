const {createApp, dbStore, app} = require('./index')
const PORT = process.env.PORT || 4321 // this can be very useful if you deploy to Heroku!
const { db } = require('./db/index')

const startListening = () => {
  app.listen(PORT, () => console.log(`listening on port ${PORT}`))
}

async function bootApp() {
  await dbStore.sync()
  await db.sync(
    // { force: true } //WARNING: drop all the tables.
  )
  await createApp()
  await startListening()
}

if (require.main === module) {
  bootApp()
} else {
  createApp()
}

