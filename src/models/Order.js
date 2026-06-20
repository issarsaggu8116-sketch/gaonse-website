import mongoose from "mongoose";

const OrderCartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.Mixed, required: true }, // Copy of product at order time
  selectedWeight: {
    weight: { type: String, required: true },
    price: { type: Number, required: true }
  },
  quantity: { type: Number, required: true }
}, { _id: false });

const ShippingDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Custom string ID (GS-XXXXXX)
    date: { type: String, required: true },
    status: { type: String, default: "Pending", enum: ["Pending", "Dispatched", "Delivered"] },
    trackingId: { type: String, default: "" },
    cart: [OrderCartItemSchema],
    shippingDetails: ShippingDetailsSchema,
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    delivery: { type: Number, required: true },
    gst: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { timestamps: true }
);

OrderSchema.virtual("id").get(function () {
  return this._id;
});
OrderSchema.set("toJSON", { virtuals: true });
OrderSchema.set("toObject", { virtuals: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
