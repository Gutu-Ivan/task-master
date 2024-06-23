const express = require('express');
const router = express.Router();
const todoController = require('../controllers/TodoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, todoController.createTodo)
router.get('/', authMiddleware, todoController.getTodos)
router.put('/', authMiddleware, todoController.updateTodo)
router.delete('/', authMiddleware, todoController.deleteTodo)
router.get('/status', authMiddleware, todoController.getTodosByStatus)

module.exports = router;
