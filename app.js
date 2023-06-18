//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


// level 2===I am removing this because i am using hash function for password encryption:- (md5)
//const encrypt = require("mongoose-encryption");

const md5 = require("md5");

const app =express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");


// this is simple javascript object/////
// const userSchema ={
//     email:String,
//     password:String
// };

/////this Schema object is created from the mongoose scchema class/////

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


// I have commented this bcuz i have used it in  .env file to (use of environment variables to keep secret safe)

//const secret ="Thisisourlittlesecret.";

// I am removing this because i am using hash function for password encryption:- (md5)

//userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:md5(req.body.password)
    });
    newUser.save();
    res.render("secrets");
});

app.post("/login",function(req,res){
    const username =req.body.username;
    const password = md5(req .body.password);

    run()
    async function run(){
        const foundUser = await User.findOne({email:username});
        if(foundUser)
        {
            if(foundUser.password === password)
            {
                res.render("secrets");
            }
        }
    }
    
});







app.listen(3000,function(){
    console.log("server is started at port 3000");

});