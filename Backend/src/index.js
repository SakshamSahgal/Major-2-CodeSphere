const dotenv = require("dotenv");
require("dotenv").config();
dotenv.config();

const { app } = require("./app");
const { connectDB } = require("./db/mongoOperations");
const { loginRoute, logoutRoute } = require("./Auth/jwt");
const { ValidateToken } = require("./Middlewares/Auth");
const { registerCollegeRoute,registeredCollegeRoute } = require("./other/Colleges");

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});


app.post("/login", loginRoute);
app.delete("/logout", ValidateToken, logoutRoute);
app.get("/registeredColleges", registeredCollegeRoute);
app.post("/registerCollege", registerCollegeRoute);