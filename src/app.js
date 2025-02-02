const express = require("express");
const cookieParser = require("cookie-parser");
// const {adminAuth} = require("./middleware/auth")
const connectDB = require("./config/database");

const app = express();

app.use(express.json());
app.use(cookieParser());
 
const authRouter = require("./routes/auth");
const profileRouter = require("../src/routes/profile");
const requestRouter = require("../src/routes/request");
const userRouter = require("../src/routes/user");


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDB()
  .then(() => {
    console.log("database connection established");
    app.listen(3000, () => {
      console.log("listening on 3000");
    });
  })
  .catch((error) => {
    console.log("connection error");
  });
