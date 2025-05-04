const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vasbeiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const userCollection = client.db("userDB").collection("users");
    const equipmentCollection = client.db("equipmentDB").collection("equipments");

    // Create a user
    app.post("/users", async(req, res)=>{
        const user = req.body;
        const query = { email: user.email };
        const existingUser = await userCollection.findOne(query);
        if (existingUser) {
            return;
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
    });

    // Get all users
    app.get("/users", async(req, res)=>{
        const query = {};
        const cursor = userCollection.find(query);
        const users = await cursor.toArray();
        res.send(users);
    });

    // Add equipment
    app.post("/equipments", async(req, res)=>{
        const equipment = req.body;
        const result = await equipmentCollection.insertOne(equipment);
        res.send(result);
    });

    // Get all equipments
    app.get("/equipments", async(req, res)=>{
        const query = {};
        const cursor = equipmentCollection.find(query);
        const equipments = await cursor.toArray();
        res.send(equipments);
    });

    // Get a single equipment by email
    app.get("/equipments/:email", async(req, res)=>{
        const email = req.params.email;
        const query = { userEmail: email };
        const cursor = equipmentCollection.find(query);
        const equipments = await cursor.toArray();
        res.send(equipments);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res)=>{
    res.send("Welcome to Sports Equipment Store's Srever Site......");
})

app.listen(port);