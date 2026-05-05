import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: String,
        image: String,
        price: Number,
        quantity: Number
      }
    ],

    // Contact Details
    contactDetails: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String
    },

    // Shipping Address
    shippingAddress: {
      addressType: {
        type: String,
        enum: ["Home", "Office", "Other"],
        default: "Home"
      },
      address: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },

    paymentMethod: {
      type: String,
      default: "COD"
    },

    itemsPrice: Number,
    taxPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },

    isPaid: {
      type: Boolean,
      default: false
    },

    paidAt: Date,

    deliveredAt: Date,

    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    razorpaySignature: {
      type: String
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;