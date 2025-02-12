const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => console.log("Conectado a MongoDB"));

//Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
});

const exerciseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

//rutes

// Crear Usuario
app.post("/api/users", async (req, res) => {
  try {
    const { username } = req.body;
    const newUser = new User({ username });
    await newUser.save();
    res.json({ username: newUser.username, _id: newUser._id });
  } catch (error) {
    res.status(400).json({ error: "Usuario ya existe o datos inválidos." });
  }
});

// Obtener Todos los Usuarios
app.get("/api/users", async (req, res) => {
  const users = await User.find({}, "username _id");
  res.json(users);
});

// Agregar Ejercicio
app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const user = await User.findById(_id);

  if (!user) return res.status(400).json({ error: "Usuario no encontrado." });

  const exerciseDate = date ? new Date(date) : new Date();
  const newExercise = new Exercise({
    userId: user._id,
    description,
    duration: parseInt(duration),
    date: exerciseDate,
  });

  await newExercise.save();

  res.json({
    username: user.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date.toDateString(),
    _id: user._id,
  });
});

//Obtener Registro de Ejercicios
app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  const user = await User.findById(_id);
  if (!user) return res.status(400).json({ error: "Usuario no encontrado." });

  let filter = { userId: _id };
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = new Date(from);
  if (to) filter.date.$lte = new Date(to);

  let exercisesQuery = Exercise.find(filter).select(
    "description duration date"
  );
  if (limit) exercisesQuery = exercisesQuery.limit(parseInt(limit));

  const log = (await exercisesQuery).map((e) => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString(),
  }));

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor corriendo en el puerto " + listener.address().port);
});
