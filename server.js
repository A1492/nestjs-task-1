const express = require('express');
const { Sequelize } = require('sequelize');
const { Product, Stock } = require('./models');
const axios = require('axios');
require('axios')
const app = express();
app.use(express.json())


app.post('/products', async (req, res) => {
    const { plu, name, shop_id } = req.body;
    try {
        const product = await Product.create({ plu, name, shop_id })
        await axios.post("http://localhost:4000/log", {
            plu,
            shop_id,
            action: 'CREATE',
            date: new Date()

        })
        res.status(201).json(product)
    }
    catch (error) {
        res.status(500).json({error})
    }
});

app.post('/stocks', async (req, res) => {
    const { product_id, shelf_quantity, order_quantity, shop_id} = req.body
    try {
        const stock = await Stock.create({ product_id, shelf_quantity, order_quantity, shop_id })
        await axios.post("http://localhost:4000/log", {
            plu,
            shop_id,
            action: 'CREATE STOCK',
            date: new Date()

        })
        res.status(201).json(stock);
    }
    catch (error) {
        res.status(500).json(error)
    }
});

app.post('/stocks/:id/increase', async (req, res) => {
    const id = req.params;
    const { shelf_quantity, order_quantity } = req.body
    try {
        const stock = await Stock.findByPk(id)
        if (stock) {
            stock.shelf_quantity += shelf_quantity
            stock.order_quantity += order_quantity
            await stock.save();
            await axios.post("http://localhost:4000/log", {
                plu,
                shop_id,
                action: 'INCREASE',
                date: new Date()
    
            })
            res.json(stock)
        }
        else {
            res.status(404).json({error: 'Не найден'})
        }
    }
    catch (error) {
        res.status(500).json({error})
    }
})

app.post('/stocks/:id/decrease', async (req, res) => {
    const id = req.params;
    const { shelf_quantity, order_quantity } = req.body
    try {
        const stock = await Stock.findByPk(id)
        if (stock) {
            stock.shelf_quantity -= shelf_quantity
            stock.order_quantity -= order_quantity
            await stock.save();
            await axios.post("http://localhost:4000/log", {
                plu,
                shop_id,
                action: 'DECREASE',
                date: new Date()
    
            })
            res.json(stock)
        }
        else {
            res.status(404).json({error: 'Не найден'})
        }
    }
    catch (error) {
        res.status(500).json({error})
    }
});

app.get('/stocks', async (req, res) => {
    const { plu, shop_id, shelf_min, shelf_max, order_min, order_max } = req.query

    try {
        const where = {}
        if (plu) where[`$product.plu$`] = plu;
        if (shop_id) where.shop_id = shop_id;
        if (shelf_min && shelf_max) where.shelf_quantity = { [Sequelize.Op.between]: [shelf_min, shelf_max]}
        if (order_min && order_max) where.order_quantity = { [Sequelize.Op.between]: [order_min, order_max]}

        const stocks = await Stock.findAll({ where, include: Product })
        await axios.post("http://localhost:4000/log", {
            plu,
            shop_id,
            action: 'CHECK STOCKS',
            date: new Date()

        })
        res.json(stocks)
    }
    catch (error) {
        res.status(500).json({error})
    }
});

app.get('/products', async (req, res) => {
    const { name, plu } = req.query
    try {
        const where = {}
        if (name) where.name = name
        if (plu) where.plu = plu

        const products = await Product.findAll({ where })
        await axios.post("http://localhost:4000/log", {
            plu,
            shop_id,
            action: 'CHECK PRODUCTS',
            date: new Date()

        })
        res.json(products)
    }
    catch (error) {
        res.status(500).json({error})
    }
})

app.listen(3000, () => {
    console.log('Сервер запущен')
})