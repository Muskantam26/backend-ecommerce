import Cart from "../models/cartModel.js";


// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { product, quantity, variantId, attributes } = req.body;

    console.log(req.body)
    const userId = req?.user?._id ?? null;

    let cart = await Cart.findOne({ user: userId });


    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product, quantity, variantId, attributes }]
      });
    } else {

      // check product + variant already cart me hai ya nahi
      const productIndex = cart.items.findIndex(
        item => item.product.toString() === product && 
                (variantId ? item.variantId?.toString() === variantId.toString() : !item.variantId)
      );

      if (productIndex > -1) {
        cart.items[productIndex].quantity += quantity;
      } else {
        cart.items.push({ product, quantity, variantId, attributes });
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get User Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Update Quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = cart.items.find(
      item => item.product.toString() === productId &&
              (variantId ? item.variantId?.toString() === variantId.toString() : !item.variantId)
    );

    if (product) {
      product.quantity = quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => !(item.product.toString() === productId &&
                (variantId ? item.variantId?.toString() === variantId.toString() : !item.variantId))
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Clear Cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    await Cart.findOneAndDelete({ user: userId });

    res.status(200).json({
      success: true,
      message: "Cart cleared"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};