//jshint esversion:6
require('dotenv').config();//no const !!
const express = require("express");
const bodyParser= require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app=express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

//object created from a mongoose.Schema class = need it for encryption
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req,res)=>{
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
           res.render("secrets"); 
        }
    });
});

app.post("/login", (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    //look through the DB and see if the password is equal to the 
    //one the user entered with this username
    User.findOne({email:username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            //if there is a user in the DB with the username typed
            if(foundUser){
            //check if the user we found has a password and match the password the user logged in in the login page
                if(foundUser.password === password){
                    res.render("secrets");
                }

            }
        }
    });
});





app.listen(3000, function(){
    console.log("Server started");
});