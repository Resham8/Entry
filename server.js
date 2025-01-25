const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require('dotenv').config();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const dataPath = path.join(__dirname, '../data.json');

async function readData() {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return { users: [], notes: [] };
    }
}

async function writeData(data) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

users = []

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
            username: username,
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


app.post("/notes", auth, function(req, res){
    const notesData = req.body.notesData;
    idCounter = Math.max(0, ...goals.map((g) => g.id)) + 1;
    const username = req.body.username;

    const newNotes = {
        id : idCounter,
        username : username,
        notesData : notesData
    }

   if(writeData(newNotes)){
     res.status(201).json({ id: newNotes.id });
   } else {
    res.status(500).json({
        msg: "error while saving note"
    })
   }

})

app.get("/notes", auth, function(req, res){
    const data = readData();
    if(data.length > 0){
        res.json(data);
    } else {
        res.status(204).json({ msg: "List is empty" });
    }
})



app.listen(3000);