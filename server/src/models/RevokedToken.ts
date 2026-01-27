import mongoose, { Schema, Document } from "mongoose";

export interface IRevokedToken extends Document {
  token: string;
  expiresAt: Date;
}

const RevokedTokenSchema: Schema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index to automatically remove expired revoked tokens
RevokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RevokedToken = mongoose.model<IRevokedToken>("RevokedToken", RevokedTokenSchema);
export default RevokedToken;
