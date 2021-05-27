#!/usr/bin/env node

import mongodb from "mongodb";

class MongoDB {

  constructor() {
    
    const url = "mongodb://localhost:27017/mydb";
    
    this.client = new mongodb.MongoClient(url, { useUnifiedTopology: true });

    this.init();
  }

  async init() {

    try {  

      // Connect the client to the server
      await this.client.connect();

      // Select database
      this.database = this.client.db("mydb");

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
