#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table';
import fileStorage from '../storage/file.js';
import dbStorage from '../storage/db.js';
import rl from '../driver/readLine.js';



class  CLIInterface {

  constructor(storageType) {
    
    this.storage = fileStorage;
    if (storageType == 'db')
    var storage = dbStorage;
  }

  load() {
    this.mainMenu();
  }

  showMessage(message) {
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
  }

  async showContacts() {

    var contacts = await this.storage.index();

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
        this.mainMenu();
      }
      else if(choose == 'd') {
        this.deleteContact(contacts);
      }
      else {
        this.editContact(contacts);
      }
    });
  }

  async deleteContact(contacts) {
    
    rl.question('enter number of item: ', async (choose) => {
      if (choose > 0 && typeof contacts[choose-1] != 'undefined') {
        if (await this.storage.delete(choose, contacts[choose-1])) {
          this.showMessage("deleted contact");
        }
      }

      this.showContacts();
    });
  }

  async editContact(contacts) {

    rl.question('enter number of item: ', async (choose) => {
      if (choose > 0 && typeof contacts[choose-1] != 'undefined') {
        let contact = await this.getContact();
        if (await this.storage.update(choose, contact, contacts[choose-1])) {
          this.showMessage("updated contact");
        }
      }

      this.showContacts();
    });
  }

  async addContact() {
    var contact = await this.getContact();

    if (await this.storage.insert(contact)) {
      this.showMessage("Saved new contact");
    }

    this.mainMenu();
  }

  async mainMenu() {

    let message1 = `s - show contacts`;
    let message2 = `a - add new contact`;
    let message3 = `q - quit`;

    console.log(message1);
    console.log(message2);
    console.log(message3);

    rl.question('choose one of item: ', (choose) => {
      if (choose == 'a') {
        this.addContact();
      }
      else if (choose == 's') {
        this.showContacts();
      }
      else {
        this.storage.exit();
        this.process.exit();
      }
    });

  }

  async getContact() {
    var contact = {};

    contact.name = await rl.questionAsync('Enter name: ');

    contact.mobile = await rl.questionAsync('Enter mobile: ');

    contact.email = await rl.questionAsync('Enter mail: ');

    return contact;
  }

};


export default CLIInterface;