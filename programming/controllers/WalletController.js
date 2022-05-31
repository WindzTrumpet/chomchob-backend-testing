import database from '../lib/database'
import { Wallet } from '../models/wallet.model'
import { Transaction } from '../models/transaction.model'
import { Exchange } from  '../models/exchange.model'
import { ApiError } from '../errors'
import _ from 'lodash'

export async function userCurrentBalance(req, res) {
    try {
        const user = req.user

        const wallets = await user.getWallets({
            attributes: ['balance'],
            include: {
                association: 'Currency',
                attributes: ['name']
            }
        })

        res.json(_.map(wallets, o => ({
            currency: o['Currency']['name'],
            balance: o['balance'],
        })))
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}

export async function transfer(req, res) {
    try {
        const body = req.body
        const requiredFields = ['origin.currencyID', 'origin.userID', 'destination.currencyID', 'destination.userID', 'amount']

        const isValid = _.every(requiredFields, o => _.has(body, o))

        if (!isValid) return res.status(400).json({
            error: true,
            code: 'parameter-invalid'
        })

        await database.transaction(async (t) => {
            const originCurrencyID = body['origin']['currencyID']
            const destinationCurrencyID = body['destination']['currencyID']
            const originUserID = body['origin']['userID']
            const destinationUserID = body['destination']['userID']

            const originWallet = await Wallet.findOne({
                where: {
                    userID: originUserID,
                    currencyID: originCurrencyID,
                },
                transaction: t,
            })

            let amount = body.amount

            if (!originWallet || originWallet.balance < amount) throw new ApiError('insufficient-funds')

            const [destinationWallet, _] = await Wallet.findOrCreate({
                where: {
                    userID: destinationUserID,
                    currencyID: destinationCurrencyID,
                },
                transaction: t,
            })

            let exchangeRate = 1

            if (originCurrencyID === destinationCurrencyID) {
                if (originUserID === destinationUserID) throw new ApiError('deposit-yourself')

                originWallet.balance -= amount
                destinationWallet.balance += amount
            } else {
                const exchange = await Exchange.findOne({
                    where: {
                        originCurrencyID,
                        destinationCurrencyID,
                    }
                })

                if (!exchange) return res.status(400).json({
                    error: true,
                    code: 'currency-cannot-exchange',
                })

                exchangeRate = parseFloat(exchange.rate)

                originWallet.balance -= amount
                destinationWallet.balance += amount * exchangeRate
            }

            await Promise.all([
                originWallet.save({ transaction: t }),
                destinationWallet.save({ transaction: t }),
                Transaction.create({
                    amount: -amount,
                    userID: originUserID,
                    withUserID: destinationUserID,
                    originCurrencyID: originCurrencyID,
                    destinationCurrencyID: destinationCurrencyID,
                    transactionType: 'withdraw',
                }, { transaction: t }),
                Transaction.create({
                    amount: amount * exchangeRate,
                    userID: destinationUserID,
                    withUserID: originUserID,
                    originCurrencyID: originCurrencyID,
                    destinationCurrencyID: destinationCurrencyID,
                    transactionType: 'deposit',
                }, { transaction: t }),
            ])
        })

        res.json({
            error: false,
        })
    } catch (err) {
        if (err instanceof ApiError) {
            return res.status(400).json({
                error: true,
                code: err.message,
            })
        }

        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}

export async function adjust(req, res) {
    try {
        const body = req.body
        const requiredFields = ['userID', 'currencyID', 'amount']

        const isValid = _.every(requiredFields, o => _.has(body, o))

        if (!isValid) return res.status(400).json({
            error: true,
            code: 'parameter-invalid'
        })

        await database.transaction(async (t) => {
            const user = req.user
            const userID = body['userID']
            const currencyID = body['currencyID']
            const amount = body['amount']

            if (amount == 0) throw new ApiError('amount-is-zero')

            const [wallet, _] = await Wallet.findOrCreate({
                where: {
                    userID,
                    currencyID
                },
                transaction: t,
            })

            wallet.balance += amount

            await Promise.all([
                wallet.save({ transaction: t }),
                Transaction.create({
                    amount: amount,
                    userID: userID,
                    withUserID: user.id,
                    originCurrencyID: currencyID,
                    destinationCurrencyID: currencyID,
                    transactionType: amount > 0 ? 'deposit' : 'withdraw',
                }, { transaction: t }),
            ])
        })

        res.json({
            error: false
        })
    } catch (err) {
        if (err instanceof ApiError) {
            return res.status(400).json({
                error: true,
                code: err.message,
            })
        }

        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}