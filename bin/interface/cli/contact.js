#!/usr/bin/env node


class  ContactCLIInterface {

  constructor(cli) {
    this.cli = cli;
  }

  load() {
    this.cli.storage.setCollection('contact');
    this.contactMenu();
  }

  async showContacts() {

    var contacts = await this.cli.storage.index();

    var table = new this.cli.Table({
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

    this.cli.rl.question('Choose one of item: ', (choose) => {
      if(choose == 'b') {
        this.contactMenu();
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

    this.cli.rl.question('enter number of item: ', async (choose) => {
      if (choose > 0 && typeof contacts[choose-1] != 'undefined') {
        if (await this.cli.storage.delete(choose, contacts[choose-1])) {
          this.cli.showMessage("deleted contact");
        }
      }

      this.showContacts();
    });
  }
  
  async editContact(contacts) {

    this.cli.rl.question('enter number of item: ', async (choose) => {
      if (choose > 0 && typeof contacts[choose-1] != 'undefined') {
        let contact = await this.getContact();
        if (await this.cli.storage.update(choose, contact, contacts[choose-1])) {
          this.cli.showMessage("updated contact");
        }
      }

      this.showContacts();
    });
  }

  async addContact() {
    var contact = await this.getContact();

    if (await this.cli.storage.insert(contact)) {
      this.cli.showMessage("Saved new contact");
    }

    this.contactMenu();
  }

  async contactMenu() {

    let message1 = `s - show contacts`;
    let message2 = `a - add new contact`;
    let message3 = `q - quit`;

    console.log(message1);
    console.log(message2);
    console.log(message3);

    this.cli.rl.question('choose one of item: ', (choose) => {
      if (choose == 'a') {
        this.addContact();
      }
      else if (choose == 's') {
        this.showContacts();
      }
      else {
        this.cli.storage.exit();
        process.exit();
      }
    });
  }

  async getContact() {
    var contact = {};

    contact.name = await this.cli.rl.questionAsync('Enter name: ');

    contact.mobile = await this.cli.rl.questionAsync('Enter mobile: ');

    contact.email = await this.cli.rl.questionAsync('Enter mail: ');

    return contact;
  }
}


export default ContactCLIInterface;