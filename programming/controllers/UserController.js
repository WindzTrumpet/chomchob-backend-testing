import database from '../lib/database'
import { User, UserAccount } from '../models/user.model'
import jwt from 'jsonwebtoken'
import Config from '../config'
import _ from 'lodash'

const config = new Config()

export async function createUser(req, res) {
    try {
        const body = req.body
        const requiredFields = ['name', 'role', 'account.username', 'account.password']

        const isValid = _.every(requiredFields, o => _.has(body, o))

        if (!isValid || !['admin', 'user'].includes(body.role)) return res.status(400).json({
            error: true,
            code: 'parameter-invalid'
        })

        const user = await database.transaction(async (t) => {
            const user = await User.create({
                name: body.name,
                role: body.role,
            })

            const account = body['account']

            await UserAccount.create({
                username: account.username,
                password: account.password,
                userID: user.id
            })

            return user
        })

        return res.json(user.toJSON())
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}

export async function authenticate(req, res) {
    try {
        // Basic Authentication
        const authorization = req.headers['authorization']

        if (!authorization) return res.status(401).json({
            error: true,
            code: 'missing-authorization-header',
        })
        else if (!authorization.startsWith('Basic ')) return res.status(401).json({
            error: true,
            code: 'invalid-authorization-header',
        })

        const splitCred = authorization.split('Basic ')
        const encodeCred = splitCred.pop()
        const decodeCred = new Buffer(encodeCred, 'base64').toString('ascii')

        const [username, password] = decodeCred.split(':')

        const userAccount = await UserAccount.findOne({ where: { username } })

        if (!userAccount || !userAccount.authenticate(password)) return res.status(401).json({
            error: true,
            code: 'incorrect-username-password',
        })

        const token = jwt.sign({ userID: userAccount.userID }, config.secret, {
            expiresIn: '1h'
        })

        return res.json({
            error: false,
            data: { token }
        })
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}

export async function verifyToken(req, res, next) {
    try {
        // Bearer Authentication
        const authorization = req.headers['authorization']

        if (!authorization || !authorization.startsWith('Bearer ')) throw jwt.JsonWebTokenError

        const splitToken = authorization.split('Bearer ')
        const token = splitToken.pop()

        const payload = jwt.verify(token, config.secret)

        const user = await User.findByPk(payload['userID'])

        if (!user) throw jwt.JsonWebTokenError

        req.user = user

        return next()
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: true,
                code: 'unauthorized',
            })
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: true,
                code: 'token-expired',
            })
        }

        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}

export function onlyAdmin(req, res, next) {
    try {
        const user = req.user

        if (!user) throw Error('verifyToken should call before using this middleware!')
        else if (user.role !== 'admin') return res.status(403).json({
            error: true,
            code: 'forbidden'
        })

        next()
    } catch(err) {
        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}

export function profile(req, res) {
    try {
        return res.json(req.user.toJSON())
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}