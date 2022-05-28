import database, { Model, DataTypes } from '../lib/database'
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

export { User, UserAccount }
