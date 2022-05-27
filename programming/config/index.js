import development from './development.js'
import production from './production.js'
import _ from 'lodash'

const REQUIRED_ENV = ['PORT']

export default class Config {
    #config

    constructor() {
        this.#init()
    }

    #init() {
        if (process.env.NODE_ENV === 'production') {
            // Validate required ENV
            if (!_.has(process.env, REQUIRED_ENV)) {
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
}