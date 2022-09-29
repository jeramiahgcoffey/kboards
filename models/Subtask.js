import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
  },
  { timestamps: true }
);

const Subtask = mongoose.model('Subtask', SubtaskSchema);

export default Subtask;
