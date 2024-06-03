import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  labels: {
    type: [String],
    validate: {
      message: (props) => `${props.value} is not a valid array of strings`,
      validator: function (v) {
        return Array.isArray(v) && v.every((el) => typeof el === "string");
      },
    },
  },
  status: {
    type: String,
    default: "open",
    enum: ["open", "closed", "not-planned", "expected-behaviour", "duplicate"],
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const IssueModel = mongoose.model("Issue", issueSchema);
