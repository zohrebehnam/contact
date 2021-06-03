#!/usr/bin/env node

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoDriver from './mongo.js';
import mongodb from 'mongodb';
import dotenv from "dotenv";


const app = express();
const config = dotenv.config();
const port = config.parsed.API_PORT;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/contact', async (req, res) => {
    
    let contacts = await mongoDriver.database.collection("contact").find({}).toArray();
    res.status(contacts.length ? 200 : 204).send(contacts);
});

app.get('/contact/:id', async (req, res) => {

    try {
        let contact = await mongoDriver.database.collection("contact").findOne({_id: mongodb.ObjectId(req.params.id)});
        if (contact !== null) {
            return res.status(200).send(contact);
        }
    }
    catch(error) {
        console.error(error.message);
    }

    return res.status(204).send({});
});

app.delete('/contact/:id', async (req, res) => {

    let query = await mongoDriver.database.collection("contact").deleteOne({_id: mongodb.ObjectId(req.params.id)});
    if (query.deletedCount) {
        return res.send({status: true, message:'Deleted'});
    }

    return res.send({status: false, message: 'Delete failed'});
});

app.post('/post', async (req, res) => {

    let contact = {
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email
    };
    let query = await mongoDriver.database.collection("contact").insert(contact);
    if (query.result.ok) {
        return res.send({status: true, message:'Saved new contact'});
    }

    return res.send({status: false, message: 'Save failed'});
});

app.put('/update/:id', async (req, res) => {

    let query = await mongoDriver.database.collection("contact").updateOne({_id: mongodb.ObjectId(req.params.id)}, { $set: req.body });
    if (query.result.ok) {
        return res.send({status: true, message: 'Updated contact'});
    }

    return res.send({status: false, message: 'Update failed'});
});

app.listen(port, () => console.log(`Contact app listening on port ${port}!`))
