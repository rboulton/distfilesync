const { Store } = require('./store')
const { Api } = require('./api')

function run (store, api) {
  api.serve()
}

async function gracefulShutdown (store, api) {
  console.log('Shutting down')
  try {
    await api.end()
    await store.end()
  } catch (err) {
    console.log('Error when shutting down: ' + err)
  }
}

(async () => {
  const store = new Store()
  const api = new Api(store)

  try {
    await store.init()
    await api.init()
  } catch (err) {
    console.log('Failed to start up: ' + err)
    process.exitCode = 1
    try {
      await gracefulShutdown(store, api)
    } catch (err) {
      console.log('Unable to shut down cleanly: ' + err)
      process.exit(1)
    }
  }

  run(store, api)
})().catch(err => {
  console.log(err)
})
