import { Schema, model, Types } from 'mongoose';
import User from './User.js';

const TaskSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
    title: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

const Task = model('Task', TaskSchema);

export default Task;
