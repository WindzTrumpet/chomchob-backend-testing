import { Currency } from '../models/currency.model'
import _ from 'lodash'

function sumWalletBalance(wallets) {
    const balances = _.map(wallets, 'balance')

    return _.sum(balances)
}

export async function list(req, res) {
    try {
        const userRole = req.user.role
        const results = []
        const currencies = await Currency.findAll({ include: 'Wallets' })

        for (const currency of currencies) {
            const result = {
                id: currency.id,
                name: currency.name,
            }

            // Only the admin can see the total balance of currency
            if (userRole === 'admin') {
                result['balance'] = sumWalletBalance(currency['Wallets'])
            }


            results.push(result)
        }

        return res.json({
            error: false,
            data: results,
        })
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}

export async function get(req, res) {
    try {
        const userRole = req.user.role
        const currencyID = req.params['currencyID']

        const currency = await Currency.findByPk(currencyID, { include: 'Wallets' })

        if (!currency) return res.status(404).json({
            error: true,
            code: 'currency-not-found',
        })

        const result = {
            id: currency.id,
            name: currency.name,
        }

        // Only the admin can see the total balance of currency
        if (userRole === 'admin') {
            result['balance'] = sumWalletBalance(currency['Wallets'])
        }

        return res.json({
            error: false,
            data: result,
        })
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}

export async function create(req, res) {
    try {
        const body = req.body

        if (!_.has(body, 'name')) return res.status(400).json({
            error: true,
            code: 'parameter-invalid'
        })

        const currency = await Currency.create({ name: body['name'] })

        return res.json(currency.toJSON())
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}