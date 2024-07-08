import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
      unique: true
    }
  },
  { timestamps: true }
);

const categoryModel = mongoose.model('Blog_category_model', categorySchema);

export default categoryModel;
