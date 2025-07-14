import Task from '../models/taskModel.js';

// Create Task
export const createTask = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  try {
    const task = await Task.create({
      title,
      description,
      user: req.user.id, // associate task with logged-in user
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Tasks for Logged-in User
export const getAllTasks = async (req, res) => {
  const { completed } = req.query;
  const filter = completed ? { completed: completed === "true" } : {};

  try {
    const tasks = await Task.find({ user: req.user.id, ...filter });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
