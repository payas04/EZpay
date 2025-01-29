const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Users, Account } = require("../db");
const router = express.Router();
module.exports = router;

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });
  res.json({
    balance: account.balance,
  });
});
router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { to, amount } = req.body;

  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );
  if (!account || account.balance < amount) {
    return res.status(400).json({
      message: " Insufficient Balance",
    });
  }

  const toAccount = await Account.findOne({ userId: to });
  if (!toAccount) {
    return res.status(400).json({
      message: "Invalid Account Id Entered",
    });
  }
  // Perform the transfer
  await Account.updateOne(
    { userId: req.userId },
    {
      $inc: {
        balance: -amount,
      },
    }
  ).session(session);

  await Account.updateOne(
    { userId: to },
    {
      $inc: {
        balance: amount,
      },
    }
  ).session(session);
  await session.commitTransaction();
  res.json({
    message: "Transfer successful",
  });
});
