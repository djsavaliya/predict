const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  friendRequests: [{
    type:String,
  }],
  sentFriendRequests: [{
    type:String,
  }],
  friends: [{
    type:String,
  }],
  referralCode: {
    type: String,
    required: true,
    default: '',
  },
  usedReferralCode: {
    type: String,
    default: '',
  },
  photo: {
    type: String,
    required: true,
    default:
      "https://res.cloudinary.com/geekysrm/image/upload/v1542221619/default-user.png"
  },
  rewardCoins: {
    type: Number,
    default: 100,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
