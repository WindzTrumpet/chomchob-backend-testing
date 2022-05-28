import express from 'express'
import Config from './config'
import routes from './routes'
import database from './lib/database'

const config = new Config()
const app = express()

await database.sync()

app.use(routes)

app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`)
})
