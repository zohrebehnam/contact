#!/usr/bin/env node

import * as chalk from 'chalk';
import * as boxen from 'boxen';
import * as  readline  from 'readline';
import promisify from 'util';
import Table from 'cli-table';
import test from './mongo.js';


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

const showContacts = () => {
  var contacts = [];

  mongo.collection("contact").find({}).toArray((err, result) => {
    if (err) throw err;
    contacts = result;
    db.close();
  });

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
      // remove an object by element index
      contacts.splice(choose-1 , 1);

      // Convert it from an object to string with stringify
      var jsonContacts = JSON.stringify(contacts);
          
      // use fs to write the file to disk
      saveFile(jsonContacts);
    }
    showContacts();
  });
};


const editContact = (contacts) => {
  rl.question('enter number of item: ', async (choose) => {
    console.log(contacts[choose-1]);
    contacts[choose-1] = await getContact();

    // Convert it from an object|array to string with stringify
    var jsonContacts = JSON.stringify(contacts);
          
    // use fs to write the file to disk
    saveFile(jsonContacts);

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

  MongoClient.connect("mongodb://localhost:27017/mydb", function (err, db) {
      
    if (err) throw err;
    var dbo = db.db("mydb");

    dbo.collection("contact").insertOne(contact, function(err, res) {
      if (err) throw err;

      showMessage("Saved new contact");
      
      db.close();
    });
  
  });

  mainMenu();
};

const mainMenu = async () => {

  let message1 = `s - show contacts`;
  let message2 = `a - add new contact`;

  console.log(message1);
  console.log(message2);

  rl.question('choose one of item: ', (choose) => {
    if (choose == 'a') {
      addContact(client);
    }
    else {
      showContacts(client);
    }
  });

};

mainMenu();