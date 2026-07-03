const Task = require('../models/Task');

const createTask = async (req, res) => {
    try {
        const { title, description, priority } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        const task = await Task.create({
            title, description, priority,
            user: req.user._id,
        });
        res.status(201).json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({ message: 'Task not found' });
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updated = await Task.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true,
            });
        res.status(200).json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({ message: 'Task not found' });
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const toggleComplete = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        task.completed = !task.completed;
        await task.save();
        res.status(200).json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask, toggleComplete };