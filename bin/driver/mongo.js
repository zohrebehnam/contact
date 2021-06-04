#!/usr/bin/env node

import mongodb from "mongodb";
import dotenv from "dotenv";


class MongoDB {

  constructor() {

    this.config = dotenv.config();
    let url = `mongodb://${this.config.parsed.MONGO_HOST}:${this.config.parsed.MONGO_PORT}`;
    if (this.config.parsed.MONGO_USERNAME.length && this.config.parsed.MONGO_PASSWORD.length) {
      url = `mongodb://${this.config.parsed.MONGO_USERNAME}:${this.config.parsed.MONGO_PASSWORD}@${this.config.parsed.MONGO_HOST}:${this.config.parsed.MONGO_PORT}`;
    }
    
    this.client = new mongodb.MongoClient(url, { useUnifiedTopology: true });

    this.init();
  }

  async init() {

    try {  

      // Connect the client to the server
      await this.client.connect();

      // Select database
      this.database = this.client.db(this.config.parsed.MONGO_DB_NAME);

      // Establish and verify connection
      await this.database.command({ ping: 1 });

    }  
    catch (err) {
      throw err;
    }
  }

};

const mongoDriver = new MongoDB();

export default mongoDriver;
