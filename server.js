const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const dataPath = path.join(__dirname, "data.json");

async function readData() {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    return JSON.parse(data || '{"users": [], "notes": []}');
  } catch (error) {
    console.error("Error reading data:", error);
    return { users: [], notes: [] };
  }
}

async function writeData(data) {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing data:", error);
    return false;
  }
}

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const data = await readData();
  
  // if (data.users.find((user) => user.username === username)) {
  //   return res.status(400).json({ msg: "Username already exists" });
  // }

  data.users.push({ username, password });
  if (await writeData(data)) {
    res.json({ msg: "You have signed up" });
  } else {
    res.status(500).json({ msg: "Error saving user" });
  }
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const data = await readData();

  const foundUser = data.users.find(
    (user) => user.username === username && user.password === password
  );

  if (foundUser) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.json({ username, token });
  } else {
    res.status(403).json({ msg: "Invalid username or password" });
  }
});

function auth(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ msg: "Token missing or invalid" });
  }
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.username = decodedData.username;
    console.log("Authenticated user:", req.username);
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ msg: "Invalid token" });
  }
}

app.get("/me", auth, async (req, res) => {
  const data = await readData();
  const foundUser = data.users.find((user) => user.username === req.username);
  if (foundUser) {
    res.json({
      username: foundUser.username,
      password: foundUser.password,
    });
  } else {
    res.json({ msg: "Invalid token" });
  }
});

app.post("/notes", auth, async (req, res) => {
  const { notesData } = req.body;
  const data = await readData();

  const newNote = {
    id: data.notes.length > 0 ? Math.max(...data.notes.map((n) => n.id)) + 1 : 1,
    username: req.username,
    notesData,
  };

  data.notes.push(newNote);
  if (await writeData(data)) {
    res.status(200).json(newNote);
  } else {
    res.status(500).json({ msg: "Error saving note" });
  }
});

app.get("/notes", auth, async (req, res) => {
  const data = await readData();
  const userNotes = data.notes.filter((note) => note.username === req.username);
  res.json(userNotes);
});

app.put("/notes/:id", auth, async (req, res) => {
  const noteId = parseInt(req.params.id);
  const { notesData } = req.body;
  const data = await readData();

  const noteIndex = data.notes.findIndex(
    (note) => note.id === noteId && note.username === req.username
  );

  if (noteIndex !== -1) {
    data.notes[noteIndex].notesData = notesData;
    if (await writeData(data)) {
      res.json({ msg: "Note updated successfully" });
    } else {
      res.status(500).json({ msg: "Error updating note" });
    }
  } else {
    res.status(404).json({ msg: "Note not found" });
  }
});

// Delete a note
app.delete("/notes/:id", auth, async (req, res) => {
  const noteId = parseInt(req.params.id);
  const data = await readData();

  const noteIndex = data.notes.findIndex(
    (note) => note.id === noteId && note.username === req.username
  );

  if (noteIndex === -1) {
    return res.status(404).json({ msg: "Note not found" });
  }

  data.notes.splice(noteIndex, 1);
  if (await writeData(data)) {
    res.json({ msg: "Note deleted successfully" });
  } else {
    res.status(500).json({ msg: "Error while deleting note" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
