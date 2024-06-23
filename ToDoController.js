const Todo = require('../models/Todo');

const createTodo = async (req, res) => {
    const {title, description} = req.body;
    const userId = req.user.id;

    try {
        const newTodo = new Todo({
            title,
            description,
            status: false,
            user: userId
        });

        const todo = await newTodo.save();
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const getTodos = async (req, res) => {
    const userId = req.user.id;

    try {
        const todos = await Todo.find({user: userId})
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

}

const updateTodo = async (req, res) => {
    const userId = req.user.id;
    const { id, title, description, status } = req.body;

    console.log('Received update request for Todo ID:', id);
    console.log('Request body:', req.body);

    try {
        let todo = await Todo.findOne({ _id: id, user: userId });

        if (!todo) {
            return res.status(404).json({ msg: 'Todo not found' });
        }

        todo.title = title || todo.title;
        todo.description = description || todo.description;
        todo.status = status !== undefined ? status : todo.status;

        await todo.save();
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteTodo = async (req, res) => {
    const userId = req.user.id;
    const {id} = req.body;

    try{
        let todo = await Todo.findOne({id: _id, user: userId});

        if (!todo) {
            return res.status(404).json({ msg: 'Todo not found' });
        }

        await Todo.deleteOne({_id: id, user: userId})
        res.json({msg: 'Todo deleted successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const getTodosByStatus = async (req, res) => {
    const userId = req.user.id;
    const {status} = req.query;

    try {
        let todos = await Todo.find({ user: userId, status: status})
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo,
    getTodosByStatus
}
