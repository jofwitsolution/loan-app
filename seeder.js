require("dotenv").config();
const { User } = require("./models/User");
const users = require("./lib/data/users");
const { dbConnect } = require("./lib/dbConnect");

dbConnect();

const importData = async () => {
  try {
    await User.deleteMany();

    await User.insertMany(users);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// if -d argument is passed from the console
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
