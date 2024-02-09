const dotenv = require("dotenv");
require("dotenv").config();

const { app } = require("./app");
const { connectDB } = require("./db/mongoOperations");
dotenv.config();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});