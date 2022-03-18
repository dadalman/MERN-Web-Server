// Import all dependencies
const dotenv = require('dotenv');
const express = require('express');
const bcrpytjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

// Configure ENV file & Require Connection File
dotenv.config({ path: './config.env' });
require('./db/conn');
const port = process.env.PORT;

// Require Model
const Users = require('./models/userSchema');
const Message = require('./models/msgSchema');

//  These Method is Used to Get Data and Cookies from FrontEnd
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello World!");
})

// Login User
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Find user if exists
        const user = await Users.findOne({ email: email });
        if (user) {
            const isMatch = await bcrpytjs.compare(password, user.password);

            if (isMatch) {
                // Generate Token which is defined in User Schema
                const token = await user.generateToken();
                res.cookie("jwt", token, {
                    // Expires Token in 24 hours
                    expires: new Date(Date.now() + 86400000),
                    httpOnly: true
                })
                res.status(200).send("Logged In")
            } else {
                res.status(400).send("Invalid Credentials");
            }
        } else {
            res.status(400).send("Invalid Credentials");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

// Registration
app.post("/register", async (req, res) => {
    try {
        // Get body or Data
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const createUser = new Users({
            username: username,
            email: email,
            password: password
        });

        // Save Method is Used to Create User or Insert User
        // But Before Saving or Inserting, password will Hash
        // Because of Hashing. After Hash, It will save to DB
        const created = await createUser.save()
        console.log(created);
        res.status(200).send("Registered");

    } catch (error) {
        res.status(400).send(error);
    }
});


// Message
app.post("/message", async (req, res) => {
    try {
        // Get body or Data
        const name = req.body.name;
        const email = req.body.email;
        const message = req.body.message;

        const sendMsg = new Message({
            name: name,
            email: email,
            message: message
        });

        // Save Method is Used to Create User or Insert User
        // But Before Saving or Inserting, password will Hash
        // Because of Hashing. After Hash, It will save to DB
        const created = await sendMsg.save()
        console.log(created);
        res.status(200).send("Sent");

    } catch (error) {
        res.status(400).send(error);
    }
});

// Logout Page
app.get('/logout', (req, res) => {
    res.clearCookie("jwt", {path: '/'})
    res.status(200).send("User Logged Out")
})

// Run Server
app.listen(port, () => {
    console.log("Server is listening at port:", port);
})


// Our backend is done and can be stored in the database
// Now its time to connect frontend with the backend 