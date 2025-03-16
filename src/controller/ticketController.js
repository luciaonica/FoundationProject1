const express = require('express');
const jwt = require("jsonwebtoken");
const ticketService = require("../service/ticketService");

const router = express.Router();

router.post("/", authenticateToken, validateTicketMiddleware, async (req,res) => {
    const ticket = req.body;
    
    ticket.author = req.user.user_id;

    const result = await ticketService.createTicket(ticket);
    if (result.success){
        res.status(201).json({message: result.message, ticket: result.result});
    }else {
        res.status(400).json(result.message);
    }        
});

router.get("/pending", authenticateToken, authorizeRole(["Manager"]), async (req, res) => {
    try {
        const tickets = await ticketService.getPendingTickets(req.user);
        res.status(200).json(tickets);
    } catch (err) {
        logger.error(`Error retrieving pending tickets: ${err.message}`);
        res.status(403).json(err.message);
    }
});

function authorizeRole(allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role_id)) {
            return res.status(403).json({ error: "Unauthorized: Employees cannot view all pending tickets." });
        }
        next();
    };
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

function validateTicketMiddleware(req, res, next) {
    const jsonBody = req.body;
    if(validateTicket(jsonBody)) {
        next();
    } else {
        res.status(400).json({
            message: "Request cannot be submitted without amount or description"
        })
    }
}

function validateTicket(data) {
    return data.amount && data.description;
}

module.exports = router