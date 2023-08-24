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

app.use(cookieParser(process.env.JWT_PRIVATE_KEY));
app.use(
  cors({
    origin: [
      process.env.LIVE_CLIENT_URL,
      "http://localhost:3000",
      "https://localhost:3001",
      "http://localhost:5173",
      "http://127.0.0.1:5500",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/codes", codeRoutes);

app.use(notFound);
app.use(errorHandler);

dbConnect();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listenning on port ${port}...`));

// async function start() {
//   try {
//     await dbConnect();
//     app.listen(port, () => console.log(`Server listenning on port ${port}...`));
//   } catch (error) {
//     console.log(error);
//   }
// }

// start();
