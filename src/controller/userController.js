const express = require('express');
const {logger} = require('../util/logger');
const userService = require("../service/userService");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", validateUserData, async (req, res) => {
    
    const result = await userService.postUser(req.body);
    if (result.success) {
        res.status(201).json(result.message);
    } else {
        res.status(400).json(result.message);
    } 
});

router.post("/login", validateUserData, async (req, res) => {
    const {username, password} = req.body;
    const data = await userService.validateLogin(username, password);
    if (data) {
        const token = jwt.sign(
            {
                user_id: data.user_id,
                username,
                role_id: data.role_id
            },
                process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "150m"
            }
        )

        res.status(200).json({message: "You have logged in successfylly!", token: token});
    } else {
        res.status(401).json({message: "Invalid login"});
    }
})

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