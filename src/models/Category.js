import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Use category slug as the string ID
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    image: { type: String, required: true }
  },
  { timestamps: true }
);

CategorySchema.virtual("id").get(function () {
  return this._id;
});
CategorySchema.set("toJSON", { virtuals: true });
CategorySchema.set("toObject", { virtuals: true });

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
