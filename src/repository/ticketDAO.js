const {DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, QueryCommand, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const {logger} = require("../util/logger");

const client = new DynamoDBClient({region: "us-east-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "Tickets";

async function createTicket(ticket) {
    const command = new PutCommand({
        TableName,
        Item: ticket
    });

    try {
        await documentClient.send(command);
        return ticket;
    } catch (err) {
        logger.error(err.name);
        throw new Error("DAO: failed to register ticket");
    }    
}

async function getTicketsByStatus(status) {
    
    const command = new QueryCommand({
        TableName,
        IndexName: "status-index", // GSI for "status"
        KeyConditionExpression: "#s = :s",
        ExpressionAttributeNames: { "#s": "status" }, // Alias for "status"
        ExpressionAttributeValues: { ":s": status }
    });

    try {
        const { Items } = await documentClient.send(command);
        logger.info(`Retrieved ${Items.length} tickets with status ${status}`);
        return Items;
    } catch (err) {
        logger.error("Error fetching tickets by status", err.message);
        throw new Error("DAO: Failed to retrieve tickets by status");
    }
}

module.exports = { createTicket, getTicketsByStatus}