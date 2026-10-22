import mongoose from "mongoose";
const eventRegistrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
    fullName: { type: String, required: true, trim: true, maxLength: 120 },
    designation: { type: String, required: true, trim: true, maxLength: 120 },
    institution: { type: String, required: true, trim: true, maxLength: 180 },
    country: { type: String, required: true, trim: true, maxLength: 80 },
    gender: {
      type: String,
      required: true,
      enum: ["Female", "Male", "Non-binary", "Prefer not to say"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    phone: { type: String, required: true, trim: true, maxLength: 40 },
    address: { type: String, required: true, trim: true, maxLength: 400 },
    cv: { type: String, required: true },
    reviewReason: { type: String, trim: true, maxLength: 1000, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
  },
  { timestamps: true },
);
eventRegistrationSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } },
);
eventRegistrationSchema.index({ status: 1, createdAt: -1 });
export default mongoose.model("EventRegistration", eventRegistrationSchema, "event_registrations");
