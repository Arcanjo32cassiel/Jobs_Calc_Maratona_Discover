const express = require("express");
const server = express();
// import { resquest, reponse } from "express";

// resquest, reponse 
server.get('/', (resquest, reponse) => {
    return reponse.sendFile(__dirname + "/views/index.html")
})


server.listen(3000, () => console.log('runing'))