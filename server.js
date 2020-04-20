// import express
const express = require('express');

// import router
const dbRouter = require('./router');

const server = express();

server.use(express.json());
server.use('/api/posts', dbRouter);

// endpoints



module.exports = server;
