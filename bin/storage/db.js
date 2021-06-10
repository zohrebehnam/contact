#!/usr/bin/env node

import mongodb from 'mongodb';
import mongoDriver from '../driver/mongo.js';

class DBStorage {

  constructor() {
    this.collection = 'contact';
  }

  async index() {

    var contacts = await mongoDriver.database.collection(this.collection).find({}).toArray();
    
    return contacts;
  }

  async retrieve(id) {

    let contact = await mongoDriver.database.collection(this.collection).findOne({_id: mongodb.ObjectId(id)});
    if (contact !== null) {
      return contact;
    }

    return null;
  }

  async delete(id, selectedContact) {

    if (selectedContact !== undefined) {
      id = selectedContact._id;
    }
    else {
      id = mongodb.ObjectId(id);
    }

    let query = await mongoDriver.database.collection(this.collection).deleteOne({_id: id});
    if (query.deletedCount) {
      return true;
    }

    return false;
  }

  async update(id, contact, selectedContact) {

    if (selectedContact !== undefined) {
      id = selectedContact._id;
    }
    else {
      id = mongodb.ObjectId(id);
    }
  
    let query = await mongoDriver.database.collection(this.collection).updateOne({_id: id}, { $set: contact });
    if (query.result.ok) {
      return true;
    }

    return false;
  }

  async insert(contact) {

    let query = await mongoDriver.database.collection(this.collection).insertOne(contact);
    if (query.result.ok) {
      return true;
    }

    return false;
  }

  exit() {
    // Do anything before close app
    mongoDriver.client.close();
  }
}

const dbStorage = new DBStorage();

export default dbStorage;