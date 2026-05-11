require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Task = require('./models/Task');
const TaskCompletion = require('./models/TaskCompletion');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/habit_tracker')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).sort({ order: 1 });
    const formattedTasks = tasks.map(t => ({ ...t.toObject(), id: t._id.toString() }));
    res.json(formattedTasks);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const { title, order, color } = req.body;
    const newTask = new Task({ userId: req.user.userId, title, order, color });
    await newTask.save();
    res.json({ ...newTask.toObject(), id: newTask._id.toString() });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await Task.findByIdAndDelete(req.params.id);
    await TaskCompletion.deleteMany({ task_id: req.params.id, userId: req.user.userId });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/completions', authMiddleware, async (req, res) => {
  try {
    const { start, end } = req.query;
    let query = { userId: req.user.userId };
    if (start && end) { query.date = { $gte: start, $lte: end }; }
    const completions = await TaskCompletion.find(query);
    const formattedCompletions = completions.map(c => ({
      ...c.toObject(), id: c._id.toString(), task_id: c.task_id.toString()
    }));
    res.json(formattedCompletions);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/completions/toggle', authMiddleware, async (req, res) => {
  try {
    const { task_id, date } = req.body;
    let completion = await TaskCompletion.findOne({ task_id, date, userId: req.user.userId });
    if (completion) {
      completion.completed = !completion.completed;
      await completion.save();
    } else {
      completion = new TaskCompletion({ userId: req.user.userId, task_id, date, completed: true });
      await completion.save();
    }
    res.json({ ...completion.toObject(), id: completion._id.toString(), task_id: completion.task_id.toString() });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
