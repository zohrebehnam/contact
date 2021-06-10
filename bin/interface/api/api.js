#!/usr/bin/env node

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";
import fileStorage from '../../storage/file.js';
import dbStorage from '../../storage/db.js';
import ContactAPI from './contact.js';
import UserAPI from './user.js';


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

    this.app.use(async (req, res, next) => {

      if (req.path == '/user/login') {
        return next();
      }

      let token = req.headers.authorization;
      if (token !== undefined) {
        token = token.replace('Bearer ', '');
        this.storage.setCollection('token');
        let result = await this.storage.index({value: token});
        if (result.length) {
          this.user_id = result[0].user_id;
          return next();
        }
      }
  
      res.status(401).send({error: 'Unauthorized.'});
    });

    const user = new UserAPI(this);
    user.load();

    const contact = new ContactAPI(this);
    contact.load();
    
    this.app.listen(this.port, () => console.log(`Contact app listening on port ${this.port}!`))
  }
}

export default APIInterface;

