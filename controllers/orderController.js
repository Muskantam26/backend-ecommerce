import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
export const createOrder = async (req, res) => {
  try {
    console.log("Create Order Request Body:", JSON.stringify(req.body, null, 2));
    console.log("Create Order User:", req.user?._id);

    const {
      contactDetails,
      shippingAddress,
      paymentMethod
    } = req.body;

    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const orderItems = cart.items.map(item => {
      if (!item.product) {
        throw new Error("One or more products in your cart are no longer available.");
      }

      const price = typeof item.product.price === 'object' 
        ? (item.product.price.sellingPrice || 0) 
        : (item.product.price || 0);

      return {
        product: item.product._id,
        name: item.product.name,
        image: item.product.image || (item.product.images && item.product.images[0]) || "",
        price: price,
        quantity: item.quantity
      };
    });

    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const shippingPrice = itemsPrice > 500 ? 0 : 50;

    const totalPrice = itemsPrice + shippingPrice;

    const order = new Order({
      user: userId,
      orderItems,
      contactDetails,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
