#!/usr/bin/env node

import mongodb from 'mongodb';
import mongoDriver from '../driver/mongo.js';

class DBStorage {

  constructor() {
  }

  setCollection(collection) {
    this.collection = collection;
  }

  async index(params) {

    params = params !== undefined ? params : {};
    var entitys = await mongoDriver.database.collection(this.collection).find(params).toArray();

    return entitys;
  }

  async retrieve(id) {

    let entity = await mongoDriver.database.collection(this.collection).findOne({_id: mongodb.ObjectId(id)});
    if (entity !== null) {
      return entity;
    }

    return null;
  }

  async delete(id, selectedEntity) {

    if (selectedEntity !== undefined) {
      id = selectedEntity._id;
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

  async update(id, entity, selectedEntity) {

    if (selectedEntity !== undefined) {
      id = selectedEntity._id;
    }
    else {
      id = mongodb.ObjectId(id);
    }
  
    let query = await mongoDriver.database.collection(this.collection).updateOne({_id: id}, { $set: entity });
    if (query.result.ok) {
      return true;
    }

    return false;
  }

  async insert(entity) {

    let query = await mongoDriver.database.collection(this.collection).insertOne(entity);
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