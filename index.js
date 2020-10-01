const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const { restart } = require('nodemon');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrqu1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productsCollection = client.db('emajohnDATABASE').collection('products');
    const ordersCollection = client.db('emajohnDATABASE').collection('orders');

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                res.sendStatus(200);
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, collection) => {
                res.send(collection)
            })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, collection) => {
                res.send(collection[0])
            })
    })

    app.post('/productByKeys', (req, res) => {
        productsCollection.find({ key: { $in: req.body } })
            .toArray((err, collection) => {
                res.send(collection)
            })
    })

    app.post('/ordersByUser', (req, res) => {
        const orders = req.body;
        ordersCollection.insertOne(orders)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    console.log('connected')
});


app.get('/', (req, res) => res.send('Welcome'));

app.listen(parseInt(process.env.PORT || 8080));