const express = require('express');
const router = express.Router();
const todoController = require("../controllers/todo");

// Get all todos on the system
router.get("/all", todoController.all_todos);
// Get the authenticated user todos
router.get("/", todoController.list_todos);
router.post("/", todoController.create_todo);
router.get("/:id", todoController.read_todo);
router.put("/:id", todoController.update_todo);
router.delete("/:id", todoController.delete_todo);


module.exports = router;