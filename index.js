require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { dbConnect } = require("./lib/dbConnect");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const accountRoutes = require("./routes/account");
const loanRoutes = require("./routes/loan");
const transactionRoutes = require("./routes/transaction");
const codeRoutes = require("./routes/code");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.JWT_PRIVATE_KEY));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/codes", codeRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;

async function start() {
  try {
    await dbConnect();
    app.listen(port, () => console.log(`Server listenning on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
}

start();
