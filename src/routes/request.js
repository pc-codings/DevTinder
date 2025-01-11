const express = require('express');
const requestRouter = express.Router();
const User = require("../models/user");

requestRouter.post('/sendConnectionRequest', function (req, res) {
    const user = req.user;
    res.send(user.firstName)
})

module.exports = requestRouter;