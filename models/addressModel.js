import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  fullName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  addressType: {
    type: String,
    enum: ["Home", "Office", "Other"],
    default: "Home"
  },

  houseNo: {
    type: String,
    required: true
  },

  area: {
    type: String,
    required: true
  },

  landmark: {
    type: String
  },

  city: {
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true
  },

  postalCode: {
    type: String,
    required: true
  },

  country: {
    type: String,
    default: "India"
  },

  isDefault: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

export default mongoose.model("Address", addressSchema);