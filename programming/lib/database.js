import { Sequelize, DataTypes, Model } from 'sequelize'
import Config from '../config'

const config = new Config()
const dbConfig = config.db

const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.pass, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mariadb',
    timezone: 'Asia/Bangkok',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
})

try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully')
} catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
}

export default sequelize
export { DataTypes, Model }