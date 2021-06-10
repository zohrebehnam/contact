#!/usr/bin/env node

import readline  from 'readline';
import {promisify} from 'util';


readline.Interface.prototype.question[promisify.custom] = function(prompt) {
  return new Promise(resolve =>
    readline.Interface.prototype.question.call(this, prompt, resolve),
  );
};
readline.Interface.prototype.questionAsync = promisify(
  readline.Interface.prototype.question,
);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export default rl;