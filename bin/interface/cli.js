#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import readline  from 'readline';
import {promisify} from 'util';
import Table from 'cli-table';
import fileStorage from '../storage/file.js';
import dbStorage from '../storage/db.js';


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

// const storage = fileStorage;
const storage = dbStorage;

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

  var contacts = await storage.index();

  var table = new Table({
    head: ['#', 'Name', 'Mobile', 'Mail'],
    colWidths: [5, 10, 20, 20]
  });

  let counter = 1;
  contacts.forEach(contact => {
    
    if (typeof contact.name != 'undefined') {
      let row = {};
      row[counter] = [contact.name, contact.mobile, contact.email];
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

const deleteContact = async (contacts) => {
  
  rl.question('enter number of item: ', async (choose) => {
    if (choose > 0 && typeof contacts[choose-1] != 'undefined') {
      if (await storage.delete(choose, contacts[choose-1])) {
        showMessage("deleted contact");
      }
    }

    showContacts();
  });
};

const editContact = async (contacts) => {

  rl.question('enter number of item: ', async (choose) => {
    if (choose > 0 && typeof contacts[choose-1] != 'undefined') {
      let contact = await getContact();
      if (await storage.update(choose, contact, contacts[choose-1])) {
        showMessage("updated contact");
      }
    }

    showContacts();
  });
};

const addContact = async () => {
  var contact = await getContact();

  if (await storage.insert(contact)) {
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
      storage.exit();
      process.exit();
    }
  });

};

const getContact = async () => {
  var contact = {};

  contact.name = await rl.questionAsync('Enter name: ');

  contact.mobile = await rl.questionAsync('Enter mobile: ');

  contact.email = await rl.questionAsync('Enter mail: ');

  return contact;
};

mainMenu();