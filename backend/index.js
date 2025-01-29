const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const jwt = require("jsonwebtoken");
// const mainRouter = require("./routes/index");
const userRouter = require("./routes/users");
const accountRouter = require("./routes/account");

// app.use("/api/v1", mainRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

app.listen(3000);
console.log("Started...");
