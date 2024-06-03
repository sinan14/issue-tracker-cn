import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
// projectSchema.set('toObject', { virtuals: true });
// projectSchema.set('toJSON', { virtuals: true });

// Virtual populate
// projectSchema.virtual('authorData', {
//   ref: 'User',
//   localField: 'author',
//   foreignField: '_id',
// });
export const ProjectModel = mongoose.model("Project", projectSchema);
