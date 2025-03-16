const userService = require("../src/service/userService");
const userDAO = require("../src/repository/userDAO");


// Mock dependencies
jest.mock("../src/repository/userDAO");

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

})