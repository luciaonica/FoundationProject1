require('dotenv').config();

const {logger} = require("./src/util/logger");
const express = require('express');

const app = express();
const PORT = 3000;

const userController = require("./src/controller/userController");
const ticketController = require("./src/controller/ticketController");

function loggerMiddleware(req, res, next){
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
}

app.use(loggerMiddleware);
app.use(express.json());

app.use('/', userController);
app.use('/tickets', ticketController);

app.get("/", (req, res) => {
    res.send("Home page");
});

app.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`)
});