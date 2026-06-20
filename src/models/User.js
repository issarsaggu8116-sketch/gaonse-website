import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Custom string ID matching u-... format
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // Optional (used for admin/guest fallback passwords)
    role: { type: String, default: "user" }, // admin or user
    otpCode: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Map _id to id virtual property for consistency
UserSchema.virtual("id").get(function () {
  return this._id;
});
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
