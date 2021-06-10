#!/usr/bin/env node

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";
import fileStorage from '../storage/file.js';
import dbStorage from '../storage/db.js';


class  APIInterface {

  constructor(storageType) {

    this.app = express();
    this.config = dotenv.config();
    this.port = this.config.parsed.API_PORT;

    this.storage = fileStorage;
    if (storageType == 'db') {
      this.storage = dbStorage;
    }
  }

  load() {

    this.app.use(cors());

    // Configuring body parser middleware
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());


    this.app.get('/contact', async (req, res) => {

      let contacts = await this.storage.index();
      res.status(contacts.length ? 200 : 204).send(contacts);
    });

    this.app.get('/contact/:id', async (req, res) => {

      try {
        let contact = await this.storage.retrieve(req.params.id);
        if (contact !== null) {
          return res.status(200).send(contact);
        }
      }
      catch(error) {
        console.error(error.message);
      }

      return res.status(204).send({});
    });

    this.app.delete('/contact/:id', async (req, res) => {

      let result = await this.storage.delete(req.params.id);
      if (result) {
        return res.send({status: true, message:'Deleted'});
      }

      return res.send({status: false, message: 'Delete failed'});
    });

    this.app.post('/post', async (req, res) => {

      let contact = {
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email
      };

      let result = await this.storage.insert(contact);
      if (result) {
        return res.send({status: true, message:'Saved new contact'});
      }

      return res.send({status: false, message: 'Save failed'});
    });

    this.app.put('/update/:id', async (req, res) => {

      let result = await this.storage.update(req.params.id, req.body);
      if (result) {
        return res.send({status: true, message: 'Updated contact'});
      }

      return res.send({status: false, message: 'Update failed'});
    });
    
    this.app.listen(this.port, () => console.log(`Contact app listening on port ${this.port}!`))
  }
}

export default APIInterface;

