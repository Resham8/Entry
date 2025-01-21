const express = require("express");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const app = express();

app.use(express.json());
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

app.post("/signin", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = users.find(user => user.username === username && user.password === password);

    if(foundUser){
        const token = jwt.sign({
            username : username
        },process.env.JWT_SECRETE);

        res.json({
            token : token
        })                
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
    console.log(users)
})



app.listen(3000);