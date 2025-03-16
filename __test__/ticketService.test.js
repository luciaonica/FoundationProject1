const ticketService = require("../src/service/ticketService");
const ticketDAO = require("../src/repository/ticketDAO");
const uuid = require("uuid");

// Mock dependencies
jest.mock("../src/repository/ticketDAO");
jest.mock("uuid"); // Mock UUID

describe("User Service Tests", () =>{
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return error when DAO fails", async () => {
        const mockTicket = { title: "Issue", description: "Fix bug", amount: 100 };
    
        ticketDAO.createTicket.mockRejectedValue(new Error("Database error")); // Simulate DAO failure
    
        const response = await ticketService.createTicket(mockTicket);
    
        expect(response).toEqual({ success: false, message: "An unexpected error occurred" });
    });

    test("should return error for negative amount", async () => {
        const mockTicket = { title: "Issue", description: "Fix bug", amount: -5 };
    
        const response = await ticketService.createTicket(mockTicket);
    
        expect(response).toEqual({ success: false, message: "Amount cannot be negative" });
        expect(ticketDAO.createTicket).not.toHaveBeenCalled(); // Ensure DAO is NOT called
    });

    test("should create a ticket successfully", async () => {
        const mockTicket = { title: "Issue", description: "Fix bug", amount: 100 };
        const mockResult = {  status: "Pending", ticket_id: "mock-uuid", ...mockTicket };

        uuid.v4.mockReturnValue("mock-uuid"); // Ensure UUID is always the same
    
        ticketDAO.createTicket.mockResolvedValue(mockResult); // Simulate DAO success
    
        const response = await ticketService.createTicket(mockTicket);
    
        expect(response).toEqual({ success: true, message: "Ticket created successfully", result: mockResult });
        
        expect(ticketDAO.createTicket).toHaveBeenCalledWith(mockResult);
    });

});