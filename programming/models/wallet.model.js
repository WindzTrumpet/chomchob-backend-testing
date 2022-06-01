import database, { DataTypes } from '../lib/database'

const Wallet = database.define('Wallet', {
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
})


export { Wallet }