const express = require('express')
const passport = require('./config/passport');
const authController = require("./controllers/auth");

// Routes
const todoRouter = require("./routes/todo");

const app = express()

// Set up mongoose
const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://todo-assessment:todo-assessment@cluster0.mwj2rtj.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Auth routes
app.post("/register", authController.register);
app.post("/login", authController.login);

app.get("/all", async function(req, res) {
    try {
        let todos = await Todo.find();
        return res.status(200).json({ todos });
    } catch (err) {
        return res.status(500).json({ err });
    }
});

// TODO routes
app.use("/todo", passport.authenticate('jwt', { session: false }), todoRouter);

app.get('/', function(req, res, next) {
    return res.send("Taxiade Assessment API");
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server started at http://localhost:${port}`))