#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import readline  from 'readline';
import {promisify} from 'util';
import Table from 'cli-table';
import mongoDriver from './mongo.js';


readline.Interface.prototype.question[promisify.custom] = function(prompt) {
  return new Promise(resolve =>
    readline.Interface.prototype.question.call(this, prompt, resolve),
  );
};
readline.Interface.prototype.questionAsync = promisify(
  readline.Interface.prototype.question,
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const showMessage = (message) => {
  const greeting = chalk.white.bold(message);

  const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor:  "green",
    backgroundColor: "#555555"
  };
  const msgBox = boxen( greeting, boxenOptions );

  console.log(msgBox);
};

const showContacts = async () => {
  var contacts = [];

  contacts = await mongoDriver.database.collection("contact").find({}).toArray();

  var table = new Table({
    head: ['#', 'Name', 'Mobile', 'Mail'],
    colWidths: [5, 10, 20, 20]
  });

  let counter = 1;
  contacts.forEach(contact => {
    
    if (typeof contact.name != 'undefined') {
      let row = {};
      row[counter] = [contact.name, contact.mobile, contact.mail];
      table.push(row);
      counter++;
    }
  });

  console.log(table.toString());

  console.log('d - delete');
  console.log('e - edit');
  console.log('b - back to main menu');
  
  rl.question('Choose one of item: ', (choose) => {
    if(choose == 'b') {
      mainMenu();
    }
    else if(choose == 'd') {
      deleteContact(contacts);
    }
    else {
      editContact(contacts);
    }
  });
};

const deleteContact = (contacts) => {
  
  rl.question('enter number of item: ', (choose) => {
    if (choose > 0 && typeof contacts[choose-1] != 'undefined') {
      let query = mongoDriver.database.collection("contact").remove(contacts[choose-1]);
      if (query.result.ok) {
        showMessage("deleted contact");
      }
    }

    showContacts();
  });
};


const editContact = (contacts) => {

  rl.question('enter number of item: ', async (choose) => {
    if (choose > 0 && typeof contacts[choose-1] != 'undefined') {
      console.log(contacts[choose-1]);
      let where = {_id: contacts[choose-1]._id};
      let contact = await getContact();
      let query = mongoDriver.database.collection("contact").updateOne(where, { $set: contact});
      if (query.result.ok) {
        showMessage("updated   contact");
      }
    }

    showContacts();
  });
};

const getContact = async () => {
  var contact = {};

  contact.name = await rl.questionAsync('Enter name: ');

  contact.mobile = await rl.questionAsync('Enter mobile: ');

  contact.mail = await rl.questionAsync('Enter mail: ');

  return contact;
};

const addContact = async () => {
  var contact = await getContact();

  let query = await mongoDriver.database.collection("contact").insertOne(contact);
  if (query.result.ok) {
    showMessage("Saved new contact");
  }

  mainMenu();
};

const mainMenu = async () => {

  let message1 = `s - show contacts`;
  let message2 = `a - add new contact`;
  let message3 = `q - quit`;

  console.log(message1);
  console.log(message2);
  console.log(message3);

  rl.question('choose one of item: ', (choose) => {
    if (choose == 'a') {
      addContact();
    }
    else if (choose == 's') {
      showContacts();
    }
    else {
      mongoDriver.client.close();
      process.exit();
    }
  });

};

mainMenu();