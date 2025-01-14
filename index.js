const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

let userId = 0;
let exercisesId = 0;
const users = [];
const exercises = [];

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users/:_id/logs", (req, res) => {
  const uId = req.params._id;
  const user = users.find((user) => user._id === uId);
  const exerc = exercises.filter((exercises) => exercises.id === uId);
  const resetArr = [];
  exerc.forEach((exercise) => {
    const description = exercise.description;
    const duration = exercise.duration;
    let date = exercise.date.toDateString();

    resetArr.push({ description, duration, date });
  });
  res.json({
    username: user.username,
    count: exerc.length,
    _id: uId,
    log: resetArr,
  });
});

app.get("/api/users/:_id/exercises", (req, res) => {
  const uId = req.params._id;
  const user = users.find((user) => user._id === uId);
  const exerc = exercises.filter((exercises) => exercises.id === uId);
  const resetArr = [];
  exerc.forEach((exercise) => {
    const description = exercise.description;
    const duration = exercise.duration;
    let date = exercise.date.toDateString();

    resetArr.push({ description, duration, date });
  });
  const lastExercise = resetArr.slice(-1)[0];

  console.log("lastExercise", lastExercise);

  res.json({
    username: user.username,
    description: lastExercise.description,
    duration: lastExercise.duration,
    date: lastExercise.date,
    _id: uId,
  });
  /*
  res.json({
    username: user.username,
    count: exerc.length,
    _id: uId,
    log: resetArr,
  });*/
});

app.post("/api/users/:_id/exercises", (req, res) => {
  // console.log("body", req.body);
  const id = req.params._id;
  const user = users.find((user) => user._id === id);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  const { description, duration, date } = req.body.description;

  const exerciseDate = date
    ? new Date(date).toDateString()
    : new Date().toDateString();

  exercises.push({
    exercisesId: `${exercisesId++}`,
    id,
    description,
    duration: Number(duration),
    date: exerciseDate,
  });
  res.json({ username: user.username, description, duration, date, _id: id });
});

app.get("/api/users", (req, res) => {
  res.json(users);
});
app.post("/api/users", (req, res) => {
  const username = req.body.username;
  const id = `${userId++}`;
  users.push({ username: username, _id: id });
  res.json({ username: username, _id: id });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
