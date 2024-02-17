const dotenv = require("dotenv");
require("dotenv").config();

const { app } = require("./app");
const { connectDB } = require("./db/mongoOperations");
dotenv.config();
const { loginRoute, logoutRoute } = require("./Auth/jwt");
const { ValidateToken } = require("./Middlewares/Auth");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});


require("./other/Colleges")(app);

app.post("/login", loginRoute);
app.delete("/logout",ValidateToken,logoutRoute);