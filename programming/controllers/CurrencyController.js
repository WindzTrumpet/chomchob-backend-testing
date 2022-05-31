import {Currency} from '../models/currency.model.js'
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

        if (userRole === 'admin') {
            result['balance'] = sumWalletBalance(currency['Wallets'])
        }

        res.json({
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