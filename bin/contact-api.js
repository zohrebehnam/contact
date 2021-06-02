#!/usr/bin/env node

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoDriver from './mongo.js';
import ObjectId from 'mongodb';

const app = express();
const port = 3000;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/contact',async (req, res) => {
    
    var contacts = [];
    contacts = await mongoDriver.database.collection("contact").find({}).toArray();
    res.send(contacts);
});

app.get('/contact/:id',async (req, res) => {

    console.log(req.params.id);
    let contact = await mongoDriver.database.collection("contact").findOne({_id: new ObjectId(req.params.id)});
    res.send(contact);
});

app.delete('/contact/:id',async (req, res) => {
    
    let query = await mongoDriver.database.collection("contact").remove({_id : req.params.id});
    if (query.result.ok) {
        res.send('deleted');
    }
});

app.listen(port, () => console.log(`Contact app listening on port ${port}!`))
