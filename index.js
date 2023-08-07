require("dotenv").config();
const express = require("express");
const { dbConnect } = require("./lib/dbConnect");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const accountRoutes = require("./routes/account");
const loanRoutes = require("./routes/loan");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/loans", loanRoutes);

app.use(errorHandler);
app.use(notFound);

dbConnect();

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server listenning on port ${port}...`));
