const mongoose = require('mongoose');

const connetionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is not supported!`
    }
  }
}, {timestamps: true})

connetionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

connetionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Not possible to send connection Request yourself...");
  }

  next();
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connetionRequestSchema);

module.exports = ConnectionRequestModel;