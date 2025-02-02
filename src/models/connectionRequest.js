const mongoose = require("mongoose");

const connectRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        messages: `{VALUE} is incorrect`,
      },
    },
  },
  { timeseries: true }
);

connectRequestSchema.index({fromUserId:1, toUserId:1})

const ConnectRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectRequestSchema
);

module.exports = ConnectRequestModel;