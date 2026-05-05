import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String }, // Made optional for legacy
    title: { type: String }, // Legacy field
    slug: { type: String }, // Made optional for legacy
    image: { type: String },
    description: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    type: { type: String, default: "category" }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;