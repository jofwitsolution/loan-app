require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { dbConnect } = require("./lib/dbConnect");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const accountRoutes = require("./routes/account");
const loanRoutes = require("./routes/loan");
const transactionRoutes = require("./routes/transaction");
const codeRoutes = require("./routes/code");
const root = require("./routes/root");

const app = express();

if (!process.env.JWT_PRIVATE_KEY) {
  throw new Error("JWT Private Key is not defined.");
}

app.use(cookieParser(process.env.JWT_PRIVATE_KEY));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(express.json());

app.use("/", root);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/codes", codeRoutes);

app.use(notFound);
app.use(errorHandler);

// Helmet for security purposes. Compression for efficiency
app.use(helmet());
app.use(
  compression({
    level: 6,
    threshold: 0,
  })
);

dbConnect();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listenning on port ${port}...`));
