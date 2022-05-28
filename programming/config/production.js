const env = process.env

export default {
    port: env.PORT,
    db: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        pass: env.DB_PASS,
        name: env.DB_NAME,
    }
}