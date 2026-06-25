import mongoose, { Schema, type Model } from "mongoose";

export interface IToken {
  userId: mongoose.Types.ObjectId;
  // SHA-256 hash of the reset token; the raw token is emailed and never stored.
  tokenHash: string;
  createdAt: Date;
}

const TokenSchema = new Schema<IToken>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  },
  tokenHash: { type: String, required: true },
  // TTL index: a reset token document self-deletes one hour after creation.
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

export const Token: Model<IToken> =
  (mongoose.models.Token as Model<IToken>) ||
  mongoose.model<IToken>("Token", TokenSchema);
