const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Welcome to Sports Equipment Store's Srever Site......");
})

app.listen(port);