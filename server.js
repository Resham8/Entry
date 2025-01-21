const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

const users = [];

app.post("/signup", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username,
        password
    })

    res.json({
        msg:"You have signed up"
    })
})