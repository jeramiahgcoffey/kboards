import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    columns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column',
      },
    ],
  },
  { timestamps: true }
);

const Board = mongoose.model('Board', BoardSchema);

export default Board;
