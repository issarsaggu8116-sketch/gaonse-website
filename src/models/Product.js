import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, required: true }
});

const WeightOptionSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const ProductSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Custom string ID matching p-... format
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    ingredients: [{ type: String }],
    benefits: [{ type: String }],
    images: [{ type: String }],
    video: { type: String, default: "" },
    weightOptions: [WeightOptionSchema],
    rating: { type: Number, default: 5.0 },
    reviews: [ReviewSchema],
    origin: { type: String, required: true },
    farmer: { type: String, default: "" },
    farmerImage: { type: String, default: "" },
    farmerStory: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

ProductSchema.virtual("id").get(function () {
  return this._id;
});
ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
