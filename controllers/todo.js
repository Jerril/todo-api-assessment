const { body, query, validationResult } = require("express-validator");
const Todo = require('../models/todo');
const user = require("../models/user");

exports.all_todos = async function(req, res) {
    try {
        let todos = await Todo.find();
        return res.status(200).json({ todos });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

exports.list_todos = async function(req, res) {
    try {
        let todos = await Todo.find({ user: req.user._id });
        return res.status(200).json({ todos });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

exports.create_todo = [
    // Sanitize and validate fields
    body("title").trim().isLength({ min: 2 }).escape(),
    body("description").trim().isLength({ min: 2 }).escape(),

    async(req, res, next) => {
        // Extract errors
        const errors = validationResult(req.body);

        if (!errors.isEmpty()) return res.json({ errros: errors.array() });

        // Create new todo
        try {
            let todo = await Todo.create({ user: req.user._id, title: req.body.title, description: req.body.description });

            return res.status(201).json({
                message: "Todo created successfully!",
                todo
            });
        } catch (err) {
            return res.status(401).json({ err });
        }
    }
]

exports.read_todo = function(req, res) {
    Todo.findById(req.params.id).populate("user").exec(function(err, todo) {
        if (err) return res.status(404).json({ err });

        return res.status(200).json({ todo });
    });
}

exports.update_todo = [
    // Sanitize and validate fields
    body("title").trim().isLength({ min: 2 }).escape(),
    body("description").trim().isLength({ min: 2 }).escape(),

    async(req, res, next) => {
        // Extract errors
        const errors = validationResult(req.body);

        if (!errors.isEmpty()) return res.json({ errros: errors.array() });

        try {
            let todo = await Todo.findById(req.params.id).exec();

            if (!todo) return res.status(404).json({ error: "Todo not found" });

            let newTodo = {
                _id: todo._id,
                user: todo.user,
                title: req.body.title ? req.body.title : todo.title,
                description: req.body.description ? req.body.description : todo.description,
            }

            let doc = await Todo.findByIdAndUpdate(req.params.id, newTodo, { new: true });

            return res.status(200).json({
                message: "Todo updated successfully!",
                doc
            });
        } catch (err) {
            return res.status(401).json({ err });
        }
    }
]

exports.delete_todo = async function(req, res) {
    try {
        let todo = await Todo.findByIdAndRemove(req.params.id);

        return res.status(200).json({ message: "Todo deleted successfully" });
    } catch (err) {
        return res.status(401).json({ err });
    }
}