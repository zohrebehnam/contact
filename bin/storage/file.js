#!/usr/bin/env node

import fs from 'fs';

class FileStorage {

  constructor() {
  }

  setCollection(collection) {
    this.fileName = collection + '.json';
  }

  async readFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.fileName, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  saveFile(jsonContacts) {
    fs.writeFile(this.fileName, jsonContacts, 'utf8', () => {});
  }

  async index() {
    var contacts = [];

    var result = await this.readFile();

    if (result !== undefined) {
      contacts = JSON.parse(result.toString());
    }

    return contacts;
  }

  async retrieve(id) {

    // Get saved contacts in file
    let contacts = await this.index();

    if (id > 0 && typeof contacts[id-1] != 'undefined') {
      return contacts[id-1];
    }

    return null;
  }

  async delete(id) {

    // Get saved contacts in file
    let contacts = await this.index();

    if (id > 0 && typeof contacts[id-1] != 'undefined') {

      // remove an object by element index
      contacts.splice(id-1 , 1);

      // Convert it from an object to string with stringify
      var jsonContacts = JSON.stringify(contacts);
          
      // use fs to write the file to disk
      this.saveFile(jsonContacts);

      return true;
    }

    return false;
  }

  async update(id, contact) {

    // Get saved contacts in file
    let contacts = await this.index();

    if (id > 0 && typeof contacts[id-1] != 'undefined') {

      contacts[id-1] = contact;

      // Convert it from an object|array to string with stringify
      var jsonContacts = JSON.stringify(contacts);
    
      // use fs to write the file to disk
      this.saveFile(jsonContacts);

      return true;
    }

    return false;
  }

  async insert(contact) {

    // Get saved contacts in file
    let contacts = await this.index();

    // Add some data to it like
    contacts.push(contact);
    
    // Convert it from an object to string with stringify
    var jsonContacts = JSON.stringify(contacts);

    // use fs to write the file to disk
    this.saveFile(jsonContacts);

    return true;
  }

  exit() {
    // Do anything before close app
  }
}

const fileStorage = new FileStorage();

export default fileStorage;
