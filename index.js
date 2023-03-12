const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
//middle wire 
app.use(cors());
app.use(express.json());
//



const uri = "mongodb+srv://tanvirtt:866230@cluster0.czo9kw9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const userCollection = client.db('mongodb').collection('users');

        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user)
            res.send(result)

        });
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user)
        });

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
            console.log(id);
        });
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const user = req.body;
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                    address: user.address
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option)
            res.send(result)
        });
    }
    finally {

    }

}
run().catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('tanvirs server')
})
app.listen(port, () => {
    console.log('server is  running on ports', port);
})