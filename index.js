const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const crypto = require("crypto");
const { count } = require("console");

const app = express();
dotenv.config();

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
  const id = req.params._id;
  const { from, to, limit } = req.query;

  const user = users.find((user) => user._id === id);
  if (!user) return res.status(400).json({ error: "User not found" });

  let log = exercises.filter((exercise) => exercise.user.id === id);

  if (from) {
    const fromDate = new Date(from);
    log = log.filter((exercise) => new Date(exercise.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    log = log.filter((exercise) => new Date(exercise.date) <= toDate);
  }

  if (limit) {
    log = log.slice(0, parseInt(limit));
  }
  res.json({
    username: user.username,
    count: log.length,
    _id: id,
    log: log.map(({ description, duration, date }) => ({
      description,
      duration,
      date,
    })),
  });
});

app.get("/api/users/:_id/exercises", (req, res) => {
  const uId = req.params._id;
  const user = users.find((user) => user._id === uId);
  const exerc = exercises.filter((exercises) => exercises.id === uId);
  console.log("exerc", exerc);

  const resetArr = [];
  exerc.forEach((exercise) => {
    console.log("exercise forEach", exercise);

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
  const { description, duration, date } = req.body;

  const exerciseDate = date
    ? new Date(date).toDateString()
    : new Date().toDateString();

  const exercise = {
    userId: id,
    description,
    duration: Number(duration),
    date: exerciseDate,
  };

  exercises.push(exercise);
  res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
    _id: id,
  });
});

app.get("/api/users", (req, res) => {
  res.json(users);
});
app.post("/api/users", (req, res) => {
  const username = req.body.username;
  const id = crypto.randomUUID(); // id unico
  users.push({ username: username, _id: id });
  res.json({ username, _id: id });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
