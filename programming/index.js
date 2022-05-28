import express from 'express'
import Config from './config/index.js'
import routes from './routes/index.js'
import database from './lib/database.js'

const config = new Config()
const app = express()

await database.sync()

app.use(routes)

app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`)
})
