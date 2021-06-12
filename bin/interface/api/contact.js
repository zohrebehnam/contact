#!/usr/bin/env node

class  ContactAPI {

  constructor(api) {
    this.api = api;
  }

  load() {

    this.api.app.get('/contact', async (req, res) => {

      if (!this.api.user_id) {
        return res.status(401).send({error: 'Unauthorized.'});
      }

      this.api.storage.setCollection('contact');
      let contacts = await this.api.storage.index();
      res.status(contacts.length ? 200 : 204).send(contacts);
    });

    this.api.app.get('/contact/:id', async (req, res) => {

      if (!this.api.user_id) {
        return res.status(401).send({error: 'Unauthorized.'});
      }

      try {
        this.api.storage.setCollection('contact');
        let contact = await this.api.storage.retrieve(req.params.id);
        if (contact !== null) {
          return res.status(200).send(contact);
        }
      }
      catch(error) {
        console.error(error.message);
      }

      return res.status(204).send({});
    });

    this.api.app.delete('/contact/:id', async (req, res) => {

      if (!this.api.user_id) {
        return res.status(401).send({error: 'Unauthorized.'});
      }

      this.api.storage.setCollection('contact');
      let result = await this.api.storage.delete(req.params.id);
      if (result) {
        return res.send({status: true, message:'Deleted'});
      }

      return res.send({status: false, message: 'Delete failed'});
    });

    this.api.app.post('/contact', async (req, res) => {

      if (!this.api.user_id) {
        return res.status(401).send({error: 'Unauthorized.'});
      }

      let contact = {
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email
      };

      this.api.storage.setCollection('contact');
      let result = await this.api.storage.insert(contact);
      if (result) {
        return res.send({status: true, message:'Saved new contact'});
      }

      return res.send({status: false, message: 'Save failed'});
    });

    this.api.app.put('/contact/:id', async (req, res) => {

      if (!this.api.user_id) {
        return res.status(401).send({error: 'Unauthorized.'});
      }

      this.api.storage.setCollection('contact');
      let result = await this.api.storage.update(req.params.id, req.body);
      if (result) {
        return res.send({status: true, message: 'Updated contact'});
      }

      return res.send({status: false, message: 'Update failed'});
    });
  }
}

export default ContactAPI;
