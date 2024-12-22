const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");

// const {adminAuth} = require("./middleware/auth")
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {

  try {
    const {firstName, lastName,emailId,password} = req.body;
    const hashPassword = await bcrypt.hash(password,10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    })
    if(!validator.isEmail(user.emailId)){
      throw new Error('Invalid email');
    }
    await user.save();
    res.send("user created successfully");
  } catch (error) {
    res.status(400).send("user not created: " + error.message);
  }
});

app.post('/login', async (req, res) => {
  try{
    const {emailId,password} = req.body;
    const user = await User.findOne({emailId:emailId});
    if(!user){
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      throw new Error("Invalid Credentials");
    }
    res.send("Login successful")
  }catch (error) {
    res.send(error.message)
  }
})

app.get("/user", async (req, res) => {
    console.log(req.body);
    const user = await User.findOne({emailId: req.body.emailId});
    if(user.length == 0){
        res.status(404).send("user not found");
    }else{
        res.send(user)
    }
})

app.get("/feed", async (req, res) => {
   
    const user = await User.find({});
    if(user.length == 0){
        res.status(404).send("user not found");
    }else{
        res.send(user)
    }
})

app.delete("/user",async(req, res) =>{
  const userId = req.body.userId;
  try{
    const user = await User.findByIdAndDelete(userId);
    if(user == null){
      res.status(404).send("user not found");
    }else{
      res.status(200).send("user deleted")
    }
    
  }catch(err){
    res.status(500).send("something went wrong")
  }
})

app.patch('/user/:userId',async (req,res)=>{
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["firstName", "lastName", "skills"]
    const isAllowedUpdate = Object.keys(data).every((k)=>
      ALLOWED_UPDATES.includes(k)
    )
    if(data.skills.length > 3){
      throw new Error("Maximum skills length exceeded")
    }
    if(!isAllowedUpdate){
      throw new Error('Invalid update')
    }
    console.log(userId);
    const user = await User.findByIdAndUpdate({_id:userId}, data);

    console.log(user)
    res.send(user);
  } catch (error) {
    res.status(404).send('something went wrong'+error.message);
  }
  
})

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
