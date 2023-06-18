//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//I have not included passport local bcuz it is being used by passport-local-mongoose internally
// npm i passport passport-local passport-local-mongoose express-session in command line

const session =require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//I have commented this 2 lines because now i am going to use passport.
// const bcrypt = require("bcrypt");
// const saltRounds= 10;


// I am removing this because i am using hash function for password encryption:- (md5)
//const encrypt = require("mongoose-encryption");


// I am removing this because I am gonna use bcrypt hash so i need to remove md5 from this file wherever it is.
//const md5 = require("md5");

const app =express();



app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

// It is must to place the code given below at this place only
app.use(session({
    secret:"our little secret.",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
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

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/secrets",function(req,res){
    if(req.isAuthenticated())
    {
        res.render("secrets");
    }
    else
    {
        res.redirect("/login");
    }
});
app.get("/logout",function(req,res){
    req.logout(function(err){
     if(err)
     {
        console.log(err);
     }
        res.redirect("/");
    });
    
});

app.post("/register",function(req,res){
    User.register({username:req.body.username, active: false}, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }

      else
      {
        passport.authenticate("local")(req,res,function(){
          res.redirect("/secrets");
        });
    }
      });

});

app.post("/login",function(req,res){
    const user =new User({
        username:req.body.username,
        password:req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
    });
});







app.listen(3000,function(){
    console.log("server is started at port 3000");

});