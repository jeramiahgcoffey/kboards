import mongoose from 'mongoose';
import idValidator from 'mongoose-id-validator';

const ColumnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
  },
  { timestamps: true }
);

ColumnSchema.plugin(idValidator);

const Column = mongoose.model('Column', ColumnSchema);

export default Column;
