const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { mongoose } = require("mongoose");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async function (req, res) {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res
          .status(400)
          .json({ message: "Invalid MongoDB ObjectId for toUserId" });
      }

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const toUser = await User.findById(toUserId);
      console.log("to", toUser);
      if (fromUserId.toString() === toUserId.toString()) {
        return res
          .status(400)
          .json({ message: "Can't send request to yourself" });
      }

      if (!toUser) {
        return res.status(404).json({ message: "user not found" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { toUserId, fromUserId },
          { toUserId: fromUserId, fromUserId: toUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({ message: "Connection already exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async function (req, res) {
    try {
      const loggedInUser = req.user;
      const { requestId, status } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(403).json({ message: "Invalid status" });
      }

      const data = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      console.log(data);

      if (!data) {
        return res.status(403).json({ message: "No connection" });
      }

      data.status = status;
      await data.save(); // Await is necessary here
      return res.status(200).json({ message: "Request status updated successfully" });
    } catch (error) {
      console.error("Error updating request status:", error.message);
      return res.status(500).json({ message: error.message });
    }
  }
);


module.exports = requestRouter;
