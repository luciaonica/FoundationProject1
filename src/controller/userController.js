const express = require('express');
const {logger} = require('../util/logger');
const userService = require("../service/userService");

const router = express.Router();

router.post("/register", validateUserData, async (req, res) => {
    
    const result = await userService.postUser(req.body);
    if (result.success) {
        res.status(201).json(result.message);
    } else {
        res.status(400).json(result.message);
    } 
});

function validateUserData(req, res, next) {
    const jsonBody = req.body;
    if(validateUser(jsonBody)) {
        next();
    } else {
        res.status(400).json("Username and password required");
    }
}

function validateUser(data) {
    return data.username && data.password;
}

module.exports = router