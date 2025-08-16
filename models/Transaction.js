import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "User",
    },
    recipientName: { type: String, required: true, trim: true, maxlength: 120 },
    note: { type: String, trim: true, maxlength: 160 },
    currency: { type: String, enum: ["GBP", "ZAR"], required: true },
    amountUSD: { type: Number, required: true, min: 1 },
    feeUSD: { type: Number, required: true, min: 0 },
    fxRate: { type: Number, required: true },
    amountRecipientMinor: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["created", "processing", "completed", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
