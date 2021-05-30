#!/usr/bin/env node

import express from 'express';

const app = express();
const port = 3000;

app.listen(port, () => console.log(`Contact app listening on port ${port}!`))
