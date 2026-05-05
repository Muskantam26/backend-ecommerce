import Wishlist from "../models/wishlistModel.js";

// Get User Wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    let wishlist = await Wishlist.findOne({ userId }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, products: [] });
    }

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        products: [productId],
      });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({
          success: false,
          message: "Product already in wishlist",
        });
      }
      wishlist.products.push(productId);
    }

    await wishlist.save();
    await wishlist.populate("products");

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("products");

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
