const mongoose = require('mongoose');

const taskCompletionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  date: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

taskCompletionSchema.index({ task_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('TaskCompletion', taskCompletionSchema);
