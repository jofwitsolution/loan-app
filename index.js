require("dotenv").config();
const express = require("express");
const { dbConnect } = require("./lib/dbConnect");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorHandler);
app.use(notFound);

dbConnect();

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server listenning on port ${port}...`));
