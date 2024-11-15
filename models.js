const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('postgres://postgres:1234@localhost:5432/product_inventory')

const Product = sequelize.define('Product', {
    plu: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

const Stock = sequelize.define('Stock', {
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        },
    allowNull: false
    },
    shelf_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

const ActionLog = sequelize.define('ActionLog', {
    plu: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
})

sequelize.sync()

module.exports = {
    Product,
    Stock,
    ActionLog
};