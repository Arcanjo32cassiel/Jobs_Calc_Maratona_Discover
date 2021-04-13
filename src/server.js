const express = require("express");
const server = express();
const routes = require('./routes');

// Using template engine
server.set('view engine', 'ejs');

// habilitate files statics
server.use(express.static("public"))

// Use the req.body
server.use(express.urlencoded({ extended: true }))


// routes
server.use(routes)

server.listen(3000, () => console.log('runing'))