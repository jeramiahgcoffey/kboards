import mongoose, { Schema, type Model } from "mongoose";

export interface IColumn {
  _id: mongoose.Types.ObjectId;
  name: string;
  color: string;
}

export interface IStatus {
  name: string;
  color: string;
}

export interface ISubtask {
  _id: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
}

export interface ITask {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: IStatus;
  subtasks: ISubtask[];
}

export interface IBoard {
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  columns: IColumn[];
  tasks: ITask[];
  createdAt: Date;
  updatedAt: Date;
}

const StatusSchema = new Schema<IStatus>(
  {
    name: { type: String, required: true },
    color: { type: String, default: "" },
  },
  { _id: false },
);

const SubtaskSchema = new Schema<ISubtask>(
  {
    title: { type: String, required: [true, "Title is required"] },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String },
    status: { type: StatusSchema, required: true },
    subtasks: { type: [SubtaskSchema], default: [] },
  },
  { timestamps: true },
);

const ColumnSchema = new Schema<IColumn>({
  name: {
    type: String,
    required: true,
    minlength: [3, "Column name must be more than 2 characters"],
  },
  color: { type: String, default: "default" },
});

const BoardSchema = new Schema<IBoard>(
  {
    name: { type: String, required: true, maxlength: 25 },
    description: { type: String, minlength: 3, maxlength: 100 },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    columns: { type: [ColumnSchema], default: [] },
    tasks: { type: [TaskSchema], default: [] },
  },
  { timestamps: true },
);

export const Board: Model<IBoard> =
  (mongoose.models.Board as Model<IBoard>) ||
  mongoose.model<IBoard>("Board", BoardSchema);
