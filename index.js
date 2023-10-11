const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cju6nq4.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const mediaCollection = client.db("social-media").collection("media");
        const commentCollection = client.db("social-media").collection("comments");
        const userCollection = client.db("social-media").collection("users");


        app.get('/media', async (req, res) => {
            const query = {};
            const cursor = mediaCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/userInfo/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email:email};
            const result = await userCollection.findOne(query);
            // console.log(result);
            res.send(result);
        })

        app.get('/postDetails/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await mediaCollection.findOne(query);
            // console.log(result);
            res.send(result);
        })

        app.get('/comments/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { postId: id };
            const cursor = commentCollection.find(query);
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result);
        })

        app.post('/media', async (req, res) => {
            // console.log(req.body);
            const doc = req.body;
            const result = await mediaCollection.insertOne(doc);
            res.send(result);
        })

        app.post('/user', async (req, res) => {
            const doc = req.body;
            const result = await userCollection.insertOne(doc);
            res.send(result);
        })

        app.post('/comments/:id', async (req, res) => {
            const id = req.params.id;
            const comment = req.body.comment;
            console.log(comment);
            const doc={
                postId: id,
                comment:comment
            }

            const result = await commentCollection.insertOne(doc);
            res.send(result);
        })

        app.patch('/reactNumUpdate/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            // console.log(req.body.react);
            const react = req.body.react;

            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    react: react
                },
            };

            const updatedBooking = await mediaCollection.updateOne(filter, updateDoc);
            res.send({ updatedBooking });
        })
    }

    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
        // 
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Bismillah')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})