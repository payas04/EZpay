const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://admin:6pgpEaU1FjIznX2o@cluster0.h9ftvjf.mongodb.net/paytm"
);
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const Users = mongoose.model("Users", userSchema);

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true },
});

const Account = mongoose.model("Account", accountSchema);
module.exports = {
  Users,
  Account,
};
