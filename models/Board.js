import mongoose from 'mongoose';
import idValidator from 'mongoose-id-validator';

const SubtaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
  },
  { timestamps: true }
);

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    subtasks: {
      type: [SubtaskSchema],
    },
  },
  { timestamps: true }
);

const ColumnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tasks: {
      type: [TaskSchema],
    },
  },
  { timestamps: true }
);

ColumnSchema.plugin(idValidator);

const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 25,
    },
    description: {
      type: String,
      minlength: 3,
      maxlength: 100,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    columns: {
      type: [ColumnSchema],
    },
  },
  { timestamps: true }
);

const Board = mongoose.model('Board', BoardSchema);

export default Board;
