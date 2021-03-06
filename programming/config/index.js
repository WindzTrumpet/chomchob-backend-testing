import development from './development'
import production from './production'
import _ from 'lodash'

const REQUIRED_ENV = ['PORT', 'SECRET', 'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASS', 'DB_NAME']

export default class Config {
    #config

    constructor() {
        this.#init()
    }

    #init() {
        if (process.env.NODE_ENV === 'production') {
            // Validate required ENV
            if (!_.every(REQUIRED_ENV, o => _.has(process.env, o))) {
                console.error(`Missing some required environment variable.\nRequired ENV: ${_.join(REQUIRED_ENV, ', ')}`)

                process.exit(1)
            }

            this.#config = production
        } else {
            this.#config = development
        }
    }

    get port() {
        return this.#config.port
    }

    get secret() {
        return this.#config.secret
    }

    get db() {
        return this.#config.db
    }
}