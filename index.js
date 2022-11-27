const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


//midleware

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvrwoc0.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const categoriesCollection = client.db('productsPortal').collection('categories');
        const productsCollection = client.db('productsPortal').collection('allProducts');
        const bookingsCollection = client.db('productsPortal').collection('bookings');

        app.get('/allProducts', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });

        // app.get('/allProducts/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const singleProduct = await productsCollection.find(query);
        //     res.send(singleProduct);
        // })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);


        })


        app.get('/categories', async (req, res) => {
            const query = {};
            const category = await categoriesCollection.find(query).toArray();
            res.send(category);
        });
        app.post('/categories', async (req, res) => {
            const category = req.body;
            const result = await categoriesCollection.insertOne(category);
            res.send(result);

        });

        app.get('/categories/:category', async (req, res) => {
            const category = req.params.category;
            const query = { category: category };
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        });
        app.get('/categories/:categoryId', async (req, res) => {
            const categoryId = req.params.categoryId;
            const query = { categoryId: categoryId };
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        });

        // app.get('/categories/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await categoriesCollection.find(query).toArray();
        //     res.send(result);
        // })



    }
    finally {

    }

}
run().catch(console.log);




app.get('/', async (req, res) => {
    res.send('Resale  products portal is running');
});

app.listen(port, () => console.log(`Resale products portal running on ${port}`))

