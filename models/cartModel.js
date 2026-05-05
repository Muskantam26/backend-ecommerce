import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },

      variantId: {
        type: mongoose.Schema.Types.ObjectId
      },

      attributes: {
        type: Map,
        of: String
      },

      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;