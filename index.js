const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

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
        const byersCollection = client.db('productsPortal').collection('byers');

        function verifyJWT(req, res, next) {
            console.log('token', req.headers.authorization);
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).send('unauthorized access')
            }
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
                if (err) {
                    return res.status(403).send({ message: 'forbidden access' });
                }
                req.decoded = decoded;
                next()
            })
        }
        app.get('/allProducts', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            // console.log(booking);
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        });

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const byer = await byersCollection.findOne(query);
            if (byer) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN);
                return res.send({ accessToken: token })
            }
            console.log(byer)
            res.status(403).send({ accessToken: '' });
        })





        app.post('/byers', async (req, res) => {
            const byer = req.body;
            console.log(byer);
            const result = await byersCollection.insertOne(byer);
            res.send(result);
        });

        app.put('/byers/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await byersCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        })


        // app.get('/bookings', verifyJWT, async (req, res) => {
        //     const email = req.query.email;
        //     const decodedEmail = req.decoded.email;
        //     if (email !== decodedEmail) {
        //         return res.status(403).send({ message: 'forbidden access' })

        //     }
        //     console.log('token', req.headers.authorization);
        //     const query = { email: email };
        //     const bookings = await bookingsCollection.findOne(query).toArray();
        //     res.send(bookings)
        // })

        app.get('/bookings', async (req, res) => {
            const query = {};
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
        });
        app.get('/byers', async (req, res) => {
            const query = {};
            const byers = await byersCollection.find(query).toArray();
            res.send(byers);
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
        app.delete('/categories', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await categoriesCollection.deleteOne(query);
            res.send(result);
        })

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

