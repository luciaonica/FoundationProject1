const userDAO = require('../repository/userDAO');
const {logger} = require("../util/logger");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

async function postUser(user) {

    try {

        if(!validateUser(user)) {
            logger.info("Username and Password must be longer than 4 characters");
            return { success: false, message: "Username and Password must be longer than 4 characters" };
        }

        const existingUser = await userDAO.getUserByUsername(user.username);

        if(existingUser){
            logger.info("Username already exists");
            return { success: false, message: "Username already exists" };
        }        

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        const data = await userDAO.postUser({
            username: user.username,
            password: hashedPassword,
            user_id: uuid.v4(),
            role_id: "Employee"
        });

        if (data) {
            logger.info("User successfully created", { username: user.username });
            return { success: true, message: "User created successfully", data };
        } else {
            logger.error("Failed to create user")
            return { success: false, message: "Failed to create user" };
        }

    } catch (err) {
        logger.error(`Error in postUser: ${err.message}`);
        return { success: false, message: "An unexpected error occurred" };
    }    
}

async function validateLogin(username, password) {
    const user = await getUserByUsername(username);
    if(user && (await bcrypt.compare(password, user.password))){
        return user;
    } else {
        return null;
    }
}

async function getUserByUsername(username) {
    if(username) {
        const data = await userDAO.getUserByUsername(username);
        if (data) {
            return data;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

function validateUser(user) {
    return user.username.length > 4 && user.password.length > 4;
}

module.exports = {postUser, validateLogin, getUserByUsername}