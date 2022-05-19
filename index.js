const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();



const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hvaqa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const listCollection = client.db('todoList').collection('list');

        app.post('/taskinfo', async (req, res) => {
            const newTask = req.body;
            console.log('adding', newTask);
            const result = await listCollection.insertOne(newTask);
            res.send(result);
        });
        app.get('/task/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = listCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await listCollection.deleteOne(query);
            res.send(result);
        });


    }
    finally {

    }


}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('To do list is running');
});

app.listen(port, () => {
    console.log('Listening port no: ', port);
})