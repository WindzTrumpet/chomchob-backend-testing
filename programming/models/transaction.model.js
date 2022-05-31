import database, { DataTypes } from '../lib/database'

const Transaction = database.define('Transaction', {
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    transactionType: {
        type: DataTypes.ENUM,
        values: ['deposit', 'withdraw'],
    }
})

export { Transaction }