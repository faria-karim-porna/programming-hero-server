const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qs1yz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const moviesCollection = client.db("programmingHero").collection("movies");

    app.post('/addFakeData', (req, res) => {
        const allMovies = req.body;
        moviesCollection.insertMany(allMovies)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })

    app.patch('/updateStatus/:id', (req, res) => {
        moviesCollection.updateOne({id: req.params.id},
        {
          $set: {status: req.body.status}
        })
        .then (result => {
          res.send(result.modifiedCount > 0)
        })
      })

    
});
app.listen(process.env.PORT || port)