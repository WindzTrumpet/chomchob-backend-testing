import { Exchange } from '../models/exchange.model'
import _ from "lodash"

export async function list(req, res) {
    try {
        const results = []
        const exchanges = await Exchange.findAll({
            attributes: ['id', 'rate'],
            include: [{
                association: 'originCurrency',
                attributes: ['name']
            }, {
                association: 'destinationCurrency',
                attributes: ['name']
            }]
        })

        for (const exchange of exchanges) {
            const result = {
                id: exchange.id,
                originCurrency: exchange.originCurrency.name,
                destinationCurrency: exchange.destinationCurrency.name,
                rate: parseFloat(exchange.rate),
            }

            results.push(result)
        }

        res.json(results)
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
        const exchangeID = req.params['exchangeID']

        const exchange = await Exchange.findByPk(exchangeID, {
            attributes: ['id', 'rate'],
            include: [{
                association: 'originCurrency',
                attributes: ['name']
            }, {
                association: 'destinationCurrency',
                attributes: ['name']
            }]
        })

        res.json({
            id: exchange.id,
            originCurrency: exchange.originCurrency.name,
            destinationCurrency: exchange.destinationCurrency.name,
            rate: parseFloat(exchange.rate),
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
        const requiredFields = ['rate', 'originCurrencyID', 'destinationCurrencyID']

        const isValid = _.every(requiredFields, o => _.has(body, o))

        if (!isValid) return res.status(400).json({
            error: true,
            code: 'parameter-invalid'
        })

        const exchange = await Exchange.create({
            rate: body.rate,
            originCurrencyID: body.originCurrencyID,
            destinationCurrencyID: body.destinationCurrencyID,
        })

        return res.json(exchange.toJSON())
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}