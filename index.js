require("dotenv").config();
const express = require("express");
const { dbConnect } = require("./lib/dbConnect");

const app = express();

dbConnect();

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server listenning on port ${port}...`));
