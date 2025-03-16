const userService = require("../src/service/userService");
const userDAO = require("../src/repository/userDAO");
const bcrypt = require("bcrypt");

// Mock dependencies
jest.mock("../src/repository/userDAO");
jest.mock("bcrypt");

describe("User Service Tests", () =>{

    beforeAll(() => {
        console.log("beforeAll Called");
    });

    afterAll(() => {
        console.log("afterAll Called");
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        console.log("afterEach called");
    });

    test("postUser should return error if username exists", async () => {
        userDAO.getUserByUsername.mockResolvedValue({ username: "testUser" });

        const response = await userService.postUser({ username: "testUser", password: "password123" });

        expect(response).toEqual({ success: false, message: "Username already exists" });
        expect(userDAO.getUserByUsername).toHaveBeenCalledWith("testUser");
    });

    test("postUser should return error if username/password is too short", async () => {
        const response = await userService.postUser({ username: "abc", password: "123" });

        expect(response).toEqual({ success: false, message: "Username and Password must be more than 4 characters" });
    });

    test("getUserByUsername should return user data", async () => {
        const mockUser = { username: "testUser", password: "hashedPassword123" };
        userDAO.getUserByUsername.mockResolvedValue(mockUser);

        const response = await userService.getUserByUsername("testUser");

        expect(response).toEqual(mockUser);
        expect(userDAO.getUserByUsername).toHaveBeenCalledWith("testUser");
    });

    test("getUserByUsername should return null if user does not exist", async () => {
        userDAO.getUserByUsername.mockResolvedValue(null);

        const response = await userService.getUserByUsername("nonExistingUser");

        expect(response).toBeNull();
        expect(userDAO.getUserByUsername).toHaveBeenCalledWith("nonExistingUser");
    });

    test("validateLogin should return null if user does not exist", async () => {
        userDAO.getUserByUsername.mockResolvedValue(null);

        const response = await userService.validateLogin("nonExistingUser", "password123");

        expect(response).toBeNull();
        expect(userDAO.getUserByUsername).toHaveBeenCalledWith("nonExistingUser");
    });

    test("validateLogin should return null if password is incorrect", async () => {
        const mockUser = { username: "testUser", password: "hashedPassword123" };
        userDAO.getUserByUsername.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false); // Simulate incorrect password

        const response = await userService.validateLogin("testUser", "wrongPassword");

        expect(response).toBeNull();
        expect(userDAO.getUserByUsername).toHaveBeenCalledWith("testUser");
        expect(bcrypt.compare).toHaveBeenCalledWith("wrongPassword", "hashedPassword123");
    });

    test("validateLogin should return user if credentials are correct", async () => {
        const mockUser = { username: "testUser", password: "hashedPassword123" };
        userDAO.getUserByUsername.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true); // Simulate correct password

        const response = await userService.validateLogin("testUser", "password123");

        expect(response).toEqual(mockUser);
        expect(userDAO.getUserByUsername).toHaveBeenCalledWith("testUser");
        expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword123");
    });

})