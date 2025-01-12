const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

let userid = 0;
const users = [];

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.get("/api/users", (req, res) => {
  res.json(users);
});
app.post("/api/users", (req, res) => {
  const username = req.body.username;
  const id = userid++;
  users.push({ username: username, _id: id });
  res.json({ username: username, _id: id });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
