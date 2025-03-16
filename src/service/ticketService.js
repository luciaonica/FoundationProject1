const ticketDAO = require("../repository/ticketDAO");
const uuid = require("uuid");
const {logger} = require("../util/logger");

async function createTicket(ticket) {
    try {
        if(ticket.amount <= 0){
            logger.info("Amount cannot be negative");
            return { success: false, message: "Amount cannot be negative" };
        }
    
        const data = {
            ...ticket,
            ticket_id: uuid.v4(),
            status: "Pending"
        }  
        const result = await ticketDAO.createTicket(data);

        if (result) {
            logger.info("Ticket successfully created", data.ticket_id);
            return { success: true, message: "Ticket created successfully", result };
        } else{
            logger.error("Failed to create ticket")
            return { success: false, message: "Failed to create ticket" };
        }       
    
    } catch (err) {
        logger.error(`Error in createTicket: ${err.message}`);
        return { success: false, message: "An unexpected error occurred" };
    }     
}

async function getPendingTickets(user) {    

    try {
        const tickets = await ticketDAO.getTicketsByStatus("Pending");
        return tickets;
    } catch (err) {
        logger.error(`Error in getPendingTickets: ${err.message}`);
        throw new Error("Service: Failed to fetch pending tickets");
    }
}

module.exports = { createTicket, getPendingTickets}