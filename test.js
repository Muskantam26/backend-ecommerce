import mongoose from "mongoose";
import Product from "./models/productModel.js";
import Category from "./models/Category.js";

const run = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/authDB");
    console.log("Connected to DB");
    console.log("Fetching products...");
    const products = await Product.find({})
      .populate("category", "name title")
      .skip(0)
      .limit(10)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments({});

    const mappedProducts = products.map(p => {
      const pObj = p.toObject();
      return {
        ...pObj,
        price: typeof pObj.price === 'object' ? (pObj.price?.sellingPrice || 0) : (pObj.price || 0),
        category: pObj.category ? {
          ...pObj.category,
          name: pObj.category.name || pObj.category.title || "Untitled Category"
        } : null,
      };
    });

    console.log("Mapped Products length:", mappedProducts.length);
    console.log("Total products:", totalProducts);
    console.log("Products:", JSON.stringify(mappedProducts, null, 2));

  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
};
run();
