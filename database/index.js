import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize('game_item_code', 'root', 'X87PdEkS3v', {
    dialect: 'mariadb',
    timezone: 'Asia/Bangkok',
})

const Customer = sequelize.define('Customer', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

const CustomerItem = sequelize.define('CustomerItem', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
    }
})

const Item = sequelize.define('Item', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
})

const Promotion = sequelize.define('Promotion', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
})

const Bundle = sequelize.define('Bundle', {
    discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
})

const BundleItem = sequelize.define('BundleItem', {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    }
})

const Order = sequelize.define('Order', {
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    state: {
        type: DataTypes.ENUM,
        values: ['draft', 'submitted', 'completed']
    },
})

const OrderLine = sequelize.define('OrderLine', {
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

// Relation

// Customer has many to CustomerItem
Customer.hasMany(CustomerItem, {
    foreignKey: 'customer_id',
    onDelete: 'CASCADE',
})
CustomerItem.belongsTo(Customer, {
    foreignKey: 'customer_id',
})

// Customer has many to Order
Customer.hasMany(Order, {
    foreignKey: 'customerID',
    onDelete: 'CASCADE',
})
Order.belongsTo(Customer, {
    foreignKey: 'customerID',
})

// Item has many to CustomerItem
Item.hasMany(CustomerItem, {
    foreignKey: 'itemID',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
})
CustomerItem.belongsTo(Item, {
    foreignKey: 'itemID',
})

// Item has many to Promotion
Item.hasMany(Promotion, {
    foreignKey: 'itemID',
    onDelete: 'CASCADE',
})
Promotion.belongsTo(Item, {
    foreignKey: 'itemID'
})

// Item has many to OrderLine
Item.hasMany(OrderLine, {
    foreignKey: 'itemID',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
})
OrderLine.belongsTo(Item, {
    foreignKey: 'itemID',
})

// Item has many to BundleItem
Item.hasMany(BundleItem, {
    foreignKey: 'itemID',
})
BundleItem.belongsTo(Item, {
    foreignKey: 'itemID',
    onDelete: 'CASCADE',
})

// Order has many to OrderLine
Order.hasMany(OrderLine, {
    foreignKey: 'orderID',
    onDelete: 'CASCADE',
})
OrderLine.belongsTo(Order, {
    foreignKey: 'orderID',
})

// Order has many to CustomerItem
Order.hasMany(CustomerItem, {
    foreignKey: 'orderID',
    onDelete: 'CASCADE',
})
CustomerItem.belongsTo(Order, {
    foreignKey: 'orderID',
})

// Promotion has many to OrderLine
Promotion.hasOne(OrderLine, {
    foreignKey: 'promotionID',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
})
OrderLine.belongsTo(Promotion, {
    foreignKey: 'promotionID',
})

// Bundle has many to BundleItem
Bundle.hasMany(BundleItem, {
    foreignKey: 'bundleID',
    onDelete: 'CASCADE',
})
BundleItem.belongsTo(Bundle, {
    foreignKey: 'bundleID',
})

// Bundle has many to OrderLine
Bundle.hasOne(OrderLine, {
    foreignKey: 'bundleID',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
})
OrderLine.belongsTo(Bundle, {
    foreignKey: 'bundleID',
})

await sequelize.sync({ force: true })