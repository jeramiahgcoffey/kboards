import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'Board is required'],
    },
    column: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
      required: [true, 'Column is required'],
    },
  },
  { timestamps: true }
);

// TODO: Verify column's boardId matches this task's boardId

const Task = mongoose.model('Task', TaskSchema);

export default Task;
