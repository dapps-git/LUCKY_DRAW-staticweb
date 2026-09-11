import mongoose, { Schema } from 'mongoose';
const CouponSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    batchId: { type: String, required: true, index: true },
    status: { type: String, enum: ['Unused', 'Used'], default: 'Unused', index: true },
    createdAt: { type: String, required: true },
    usedAt: { type: String },
    usedByParticipantId: { type: String },
    usedByParticipantName: { type: String },
    usedByParticipantPhone: { type: String },
}, {
    timestamps: true,
});
export const Coupon = mongoose.model('Coupon', CouponSchema);
