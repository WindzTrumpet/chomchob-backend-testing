import express from 'express'
import Config from './config/index.js'
import routes from './routes/index.js'

const config = new Config()
const app = express()

app.use(routes)

app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`)
})
