const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
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
    //   GET : get data from database
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
