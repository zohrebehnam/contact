#!/usr/bin/env node

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';


class  UserAPI {

    constructor(api) {
      this.api = api;
    }

    load() {
  
      this.api.app.get('/user', async (req, res) => {

        if (!this.api.user_id) {
          return res.status(401).send({error: 'Unauthorized.'});
        }
  
        this.api.storage.setCollection('user');
        let user = await this.api.storage.retrieve(this.api.user_id);
        delete user.password;

        res.status(user._id ? 200 : 204).send(user);
      });
  
      this.api.app.post('/user/login', async (req, res) => {

        req.body.password = crypto.createHash('sha1').update(req.body.password).digest('hex');
  
        let user = {
          email: req.body.email,
          password: req.body.password,
        };
  
        this.api.storage.setCollection('user');
        let result = await this.api.storage.index(user);

        if (result.length) {

          let token = {
            user_id: result[0]._id,
            value: uuidv4(),
          };

          this.api.storage.setCollection('token');
          result = await this.api.storage.insert(token);

          if (result) {
            return res.send({status: true, token: token.value, message:'You are logined'});
          }
        }
  
        return res.status(403).send({status: false, message: 'User not found'});
      });
    }
  }
  
  export default UserAPI;
  