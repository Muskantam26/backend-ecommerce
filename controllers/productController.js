import Product from "../models/productModel.js";

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json({ success: true, message: "Product created successfully", product: createdProduct });
  } catch (error) {
    console.error("Create Product Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || 1000000;
      query.$or = [
        { "price.sellingPrice": { $gte: min, $lte: max } },
        { price: { $gte: min, $lte: max } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product
      .find(query)
      .populate("category", "name title")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(query);

    const mappedProducts = products.map(p => {
      const pObj = p.toObject();
      return {
        ...pObj,
        price: typeof pObj.price === 'object' ? (pObj.price?.sellingPrice || 0) : (pObj.price || 0),
        category: pObj.category && pObj.category._id ? {
          ...pObj.category,
          name: pObj.category.name || pObj.category.title || "Untitled Category"
        } : (typeof pObj.category === 'string' || (pObj.category && pObj.category.toString) ? { _id: pObj.category.toString(), name: "Untitled Category" } : null),
      };
    });

    res.json({
      success: true,
      data: {
        products: mappedProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalProducts / limit),
          totalItems: totalProducts
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product
      .findById(req.params.id)
      .populate("category", "name title");

    if (product) {
      const pObj = product.toObject();
      pObj.price = typeof pObj.price === 'object' ? (pObj.price?.sellingPrice || 0) : (pObj.price || 0);
      if (pObj.category) {
        pObj.category.name = pObj.category.name || pObj.category.title || "Untitled Category";
      }
      res.json({ success: true, data: pObj });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: "Product removed successfully" });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};