import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String }, // Made optional to support legacy
    price: { type: mongoose.Schema.Types.Mixed, required: true },
    discount: { type: mongoose.Schema.Types.Mixed, default: 0 },
    taxIncluded: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    stockStatus: { type: String, default: "in_stock" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tag: { type: String },
    description: { type: String, required: true },
    
    colors: [{ name: String, hex: String }],
    sizes: [{ type: String }],
    customVariants: [{ variantType: String, options: [{ type: String }] }],
    keyFeatures: [{ type: String }],
    specifications: [{ label: String, value: String }],
    metaKeywords: [{ type: String }],
    
    pv: { type: Number, default: 0 },
    dp: { type: Number, default: 0 },
    bp: { type: Number, default: 0 },
    sku: { type: String },
    
    metaDescription: { type: String },
    status: { type: String, default: "ACTIVE" },
    featured: { type: Boolean, default: false },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    
    images: [{ type: String }],
    image: { type: String }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;