const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://paritosh6264:123qwerty@cluster0.rxm7x.mongodb.net/devTinder"
    );
}

module.exports = connectDB;