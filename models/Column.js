import mongoose from 'mongoose';

const ColumnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  { timestamps: true }
);

const Column = mongoose.model('Column', ColumnSchema);

export default Column;
