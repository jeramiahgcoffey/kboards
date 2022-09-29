import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    column: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
      required: [true, 'Column is required'],
    },
    subtasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subtask',
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', TaskSchema);

export default Task;
