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



        // GET API

        app.get('/travel', async (req, res) => {
            // res.send('Hello World from education')
            const cursor = travelCollection.find({});
            const toursimdata = await cursor.toArray();
            res.send(toursimdata);
        })

        // GET API FROM Single ID
        app.get('/travel/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const travel = await travelCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(travel);
        })

        // POST API FOR  Add  NEW TravelList

        app.post('/travel', async (req, res) => {
            const travel = req.body;
            console.log('hit the post api', travel);

            const result = await travelCollection.insertOne(travel);
            console.log(result);
            res.json(result)
        });




        /*----------------------------------
          USERS API
         --------------------------------------------*/

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // user registration  and google singin save users or bypassing users to mongoDB

        //1. with email password (POST Method useFirebase)
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });


        //2.google singin save users (PUT Method useFirebase)
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // make admin and admin can add another admin api
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })



        //GET Blogs API
        app.get('/blogs', async (req, res) => {
            const cursor = productCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let blogs;
            const count = await cursor.count();

            if (page) {
                blogs = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                blogs = await cursor.toArray();
            }

            res.send({
                count,
                blogs
            });
        });


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