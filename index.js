const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());

// connecting data base

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntup3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();

    const serviceCollection = client.db('geniusCar').collection('service');
    const orderCollection = client.db('geniusCar').collection('order');

    //  AUTH 
    app.get('/login', async (req, res) => {
      
    })
    //   GET : get data from database Services API
    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
        const service = await cursor.toArray();
        res.send(service);
    });
      
        app.get('/service/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };

          const service = await serviceCollection.findOne(query);

          res.send(service);
      });
/* --------get end-------- */

    //   POST : Send data or add data in database
      
      app.post('/service', async (req, res) => {
          const newService = req.body;
          const result = await serviceCollection.insertOne(newService);

          res.send(result);
      });

    //   Delete: delete data from database
      
      app.delete('/service/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await serviceCollection.deleteOne(query);
          res.send(result);

      })
    // order collection API
    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })

    // get api for order

    app.get('/order', async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = {email:email};
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders)
    })
  } finally {
  }
}

run().catch(console.dir);
console.log(process.env);

app.get('/', (req, res) => {
  res.send('Running Genius Server');
});

app.listen(port, () => {
  console.log('Listening port', port);
});
