#!/usr/bin/env node

import CLIInterface from './interface/cli.js';
import APIInterface from './interface/api.js';
import rl from './driver/readLine.js';


const mainMenu = async () => {

  let message3 = `d - DB`;
  let message4 = `f - FILE`;

  console.log(message3);
  console.log(message4);

  rl.question('Select sotrage type: ', (choose) => {
    const storage = (choose == 'd') ? 'db' : 'file';

    let message1 = `a - API`;
    let message2 = `c - CLI`;


    console.log(message1);
    console.log(message2);

    rl.question('Select interface: ', (choose) => {
      const selectedInterface = (choose == 'a') ? new APIInterface(storage) : new CLIInterface(storage);
      selectedInterface.load();
    });
  });
};

mainMenu();