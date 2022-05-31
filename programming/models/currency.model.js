import database, { DataTypes } from '../lib/database'
import { Wallet } from './wallet.model'
import { Exchange } from './exchange.model.js'

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

export { Currency }