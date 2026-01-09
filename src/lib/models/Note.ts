import mongoose, { Schema } from "mongoose";

export type NoteDoc = {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const noteSchema = new Schema<NoteDoc>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    tags: { type: [String], default: [] },
    isFavorite: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

noteSchema.index({ userId: 1, updatedAt: -1 });

export const Note = (mongoose.models.Note as mongoose.Model<NoteDoc>) || mongoose.model<NoteDoc>("Note", noteSchema);
