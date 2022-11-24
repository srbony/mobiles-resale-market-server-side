const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;


//midleware

app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
    res.send('Resale  products portal is running');
});

app.listen(port, () => console.log(`Resale products portal running on ${port}`))

