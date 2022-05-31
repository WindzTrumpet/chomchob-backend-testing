import database, { DataTypes } from '../lib/database'
import { Wallet } from './wallet.model'
import { Exchange } from './exchange.model'
import { Transaction } from './transaction.model'

const Currency = database.define('Currency', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('name', value.toUpperCase())
        }
    }
})

Currency.hasMany(Wallet, {
    foreignKey: 'currencyID',
    onDelete: 'RESTRICT',
})
Wallet.belongsTo(Currency, {
    foreignKey: 'currencyID',
})

Currency.hasMany(Exchange, {
    foreignKey: 'originCurrencyID',
    onDelete: 'CASCADE',
})
Exchange.belongsTo(Currency, {
    foreignKey: 'originCurrencyID',
    as: 'originCurrency',
})

Currency.hasMany(Exchange, {
    foreignKey: 'destinationCurrencyID',
    onDelete: 'CASCADE',
})
Exchange.belongsTo(Currency, {
    foreignKey: 'destinationCurrencyID',
    as: 'destinationCurrency',
})

Currency.hasMany(Transaction, {
    foreignKey: 'originCurrencyID',
    onDelete: 'CASCADE',
})
Transaction.belongsTo(Currency, {
    foreignKey: 'originCurrencyID',
    as: 'originTransactionCurrency',
})

Currency.hasMany(Transaction, {
    foreignKey: 'destinationCurrencyID',
    onDelete: 'CASCADE',
})
Transaction.belongsTo(Currency, {
    foreignKey: 'destinationCurrencyID',
    as: 'destinationTransactionCurrency',
})

export { Currency }