#!/usr/bin/env node

import crypto from 'crypto';

class  UserCLIInterface {

    constructor(cli) {
      this.cli = cli;
    }
  
    load() {
      this.cli.storage.setCollection('user');
      this.userMenu();
    }
  
    async showUsers() {
  
      var users = await this.cli.storage.index();
  
      var table = new this.cli.Table({
        head: ['#', 'Name', 'Mail'],
        colWidths: [5, 10, 20]
      });
  
      let counter = 1;
      users.forEach(user => {
  
        if (typeof user.name != 'undefined') {
          let row = {};
          row[counter] = [user.name, user.email];
          table.push(row);
          counter++;
        }
      });
  
      console.log(table.toString());
  
      console.log('d - delete');
      console.log('e - edit');
      console.log('b - back to main menu');
  
      this.cli.rl.question('Choose one of item: ', (choose) => {
        if(choose == 'b') {
          this.userMenu();
        }
        else if(choose == 'd') {
          this.deleteUser(users);
        }
        else {
          this.editUser(users);
        }
      });
    }
  
    async deleteUser(users) {
  
      this.cli.rl.question('enter number of item: ', async (choose) => {
        if (choose > 0 && typeof users[choose-1] != 'undefined') {
          if (await this.cli.storage.delete(choose, users[choose-1])) {
            this.cli.showMessage("deleted user");
          }
        }
  
        this.showUsers();
      });
    }
    
    async editUser(users) {
  
      this.cli.rl.question('enter number of item: ', async (choose) => {
        if (choose > 0 && typeof users[choose-1] != 'undefined') {
          let user = await this.getUser();
          if (await this.cli.storage.update(choose, user, users[choose-1])) {
            this.cli.showMessage("updated user");
          }
        }
  
        this.showUsers();
      });
    }
  
    async addUser() {
      var user = await this.getUser();
  
      if (await this.cli.storage.insert(user)) {
        this.cli.showMessage("Saved new user");
      }
  
      this.userMenu();
    }
  
    async userMenu() {
  
      let message1 = `s - show users`;
      let message2 = `a - add new user`;
      let message3 = `q - quit`;
  
      console.log(message1);
      console.log(message2);
      console.log(message3);
  
      this.cli.rl.question('choose one of item: ', (choose) => {
        if (choose == 'a') {
          this.addUser();
        }
        else if (choose == 's') {
          this.showUsers();
        }
        else {
          this.cli.storage.exit();
          process.exit();
        }
      });
    }
  
    async getUser() {
      var user = {};
  
      user.name = await this.cli.rl.questionAsync('Enter name: ');
  
      user.email = await this.cli.rl.questionAsync('Enter mail: ');
  
      user.password = await this.cli.rl.questionAsync('Enter password: ');

      user.password = crypto.createHash('sha1').update(user.password).digest('hex');
  
      return user;
    }
  }
  
  
  export default UserCLIInterface;