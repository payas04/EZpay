const express = require("express");
const router = express.Router();
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");
const { Users, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const bcrypt = require("bcrypt");
const saltRounds = 10;
router.post("/signup", async function (req, res) {
  const signupSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    username: z.string().email("Username must be an Email"),
    password: z.string().min(5, "Password must be atleast 5 characters long"),
  });
  const validationResult = signupSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: "Invalid Input",
      errors: validationResult.error.errors,
    });
  }
  const user = await Users.findOne({
    username: req.body.username,
  });
  console.log(user);
  if (user) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const newUser = new Users({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    username: req.body.username,
    password: hashedPassword, //Use bycrypt to store passwords instead of storing them directly in database
  });
  const userId = newUser._id;
  await newUser.save();

  //Now creating a new account
  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign(
    {
      userId: userId,
    },
    JWT_SECRET
  );

  return res
    .status(201)
    .json({ message: "User created successfully", token: token });
});

router.post("/signin", async (req, res) => {
  const signinSchema = z.object({
    username: z.string().email("Invalid email format"),
    password: z.string().min(5, "Password must be at least 5 characters long"),
  });

  // Validate request body
  const validationResult = signinSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ message: "Incorrect inputs" });
  }

  const username = req.body.username;
  const password = req.body.password;

  const user = await Users.findOne({
    username: username,
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid Username or Password" });
  }

  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (err || !result) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    return res.status(200).json({ token });
  });
});

router.put("/", authMiddleware, async function (req, res) {
  const updateBody = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
  });

  const updateData = updateBody.safeParse(req.body);
  if (!updateData.success) {
    return res.status(400).json({
      message: "Enter Valid Data",
    });
  }
  await Users.updateOne({ _id: req.userId }, { $set: updateData.data });
  res.status(200).json({
    message: "Data Updated Successfully",
  });
});

router.get("/me", authMiddleware, async function (req, res) {
  const user = await Users.findById(req.userId);

  if (user) {
    return res.status(200).json({ user });
  } else return res.status(400).json({ message: "User not found" });
});

router.get("/bulk", async function (req, res) {
  const filter = new RegExp(req.query.filter, "i");
  const user = await Users.find({
    $or: [{ firstName: { $regex: filter } }, { lastName: { $regex: filter } }],
  });

  res.status(200).json({
    users: user.map((user) => ({
      username: user.username,
      firstname: user.firstName,
      lastname: user.lastName,
      userId: user._id,
    })),
  });
});

module.exports = router;
