const express = require("express");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

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

function auth(req, res, next){
    const token = req.headers.token;

    if(!token){
        res.json({
            msg:"Invalid token"
        })
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRETE);

    if(decodedData.username){
        req.username = decodedData.username;
        next();
    } else {
        res.json({
            msg: "You are not logged in"
        })
    }    
}

app.get("/me", auth, function(req, res){
    let foundUser = users.find(user => user.username === req.username);

    if(foundUser){
        res.json({
            username : foundUser.username,
            password : foundUser.password
        });
    } else {
        res.json({ msg: "Invalid token"});
    }
})




app.listen(3000);