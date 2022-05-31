import database, { DataTypes } from '../lib/database'
import { Wallet } from './wallet.model.js'
import { Transaction } from './transaction.model'
import useBcrypt from 'sequelize-bcrypt'

const User = database.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM,
        values: ['admin', 'user']
    },
})

const UserAccount = database.define('UserAccount', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

useBcrypt(UserAccount)

User.hasOne(UserAccount, {
    foreignKey: 'userID',
    onDelete: 'CASCADE',
})
UserAccount.belongsTo(User, {
    foreignKey: 'userID',
})

User.hasMany(Wallet, {
    foreignKey: 'userID',
    onDelete: 'CASCADE',
})
Wallet.belongsTo(User, {
    foreignKey: 'userID',
})

User.hasMany(Transaction, {
    foreignKey: 'userID',
    onDelete: 'CASCADE',
})
Transaction.belongsTo(User, {
    foreignKey: 'userID',
})

User.hasMany(Transaction, {
    foreignKey: 'withUserID',
    onDelete: 'CASCADE',
})
Transaction.belongsTo(User, {
    foreignKey: 'withUserID',
})

export { User, UserAccount }
