const express = require('express');
const cors = require('cors');

const app = express();


//midleware

app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
    res.send('products portal is running');
})