import database, { DataTypes } from '../lib/database'

const Exchange = database.define('Exchange', {
    rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
})

export { Exchange }
