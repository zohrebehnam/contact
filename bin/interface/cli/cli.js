#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table';
import fileStorage from '../../storage/file.js';
import dbStorage from '../../storage/db.js';
import rl from '../../driver/readLine.js';
import ContactCLIInterface from './contact.js';
import UserCLIInterface from './user.js';


class  CLIInterface {

  constructor(storageType) {
    this.rl = rl;
    this.Table = Table;
    this.storage = fileStorage;
    this.storageType = storageType;

    if (this.storageType == 'db') {
      this.storage = dbStorage;
    }
  }

  load() {
    this.menu();
  }

  showMessage(message, type) {
    type = type !== undefined ? type : 'success';
    const greeting = chalk.white.bold(message);

    const boxenOptions = {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor:  type == 'success' ? "green" : "red",
      backgroundColor: "#555555"
    };
    const msgBox = boxen( greeting, boxenOptions );

    console.log(msgBox);
  }

  async menu() {

    let message1 = `c - Manage contacts`;
    let message2 = `u - Manage users`;
    let message3 = `q - quit`;

    console.log(message1);
    console.log(message2);
    console.log(message3);

    rl.question('choose one of item: ', (choose) => {
      if (choose == 'c' || choose == 'u') {

        if (choose == 'u' && this.storageType !== 'db') {
          this.showMessage('You can not manage user without db storage.', 'error');
          this.menu();
          return;
        }

        const selectedInterface = (choose == 'u') ? new UserCLIInterface(this) : new ContactCLIInterface(this);
        selectedInterface.load();
      }
      else {
        this.storage.exit();
        process.exit();
      }
    });
  }
}


export default CLIInterface;