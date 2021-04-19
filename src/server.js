const express = require("express");
const server = express();
const routes = require('./routes');
const path = require("path");


// Using template engine
server.set('view engine', 'ejs');

// Change the localization of  the  views folder
server.set('views', path.join(__dirname, 'views'))

// habilitate files statics
server.use(express.static("public"))

// Use the req.body
server.use(express.urlencoded({ extended: true }))


// routes
server.use(routes)

server.listen(3000, () => console.log('runing'))