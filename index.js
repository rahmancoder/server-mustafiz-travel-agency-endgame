const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

//middlewire
app.use(cors());
app.use(express.json());



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


//  With ENV file
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqmhk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


// with environment variable got bad auth , Authentication failed
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqmhk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected');

        const database = client.db('mustafiz_endGame');
        const servicesCollection = database.collection('blogs');





    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Mustafiz ENDGame Server is running!')
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// Deploument Server link in Heroku
//
//  1. Steps install Heroku CLI
//  2. heroku login
//  3. heroku create
//-------------------------------
// For continuos integrate and deployment in Heroky CLI
//  4. git push heroku main 