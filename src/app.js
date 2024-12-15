const express = require('express');

// const {adminAuth} = require("./middleware/auth")
const connectDB = require("./config/database");
const User = require('./models/user');

const app = express();

app.post('/signup',async(req,res)=>{
    const user = new User({
        firstName: "John",
        lastName: "Doe",
        emailId:"john@example.com",
        password: "abcdefgh"
    })
    await user.save();
    res.send("user created successfully")

})

connectDB()
    .then(()=>{
        console.log("database connection established");
        app.listen(3000, () => {
            console.log('listening on 3000')
        });
    })
    .catch((error)=>{
        console.log("connection error")
    })




