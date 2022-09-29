import mongoose from 'mongoose';

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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Board = mongoose.model('Board', BoardSchema);

export default Board;
