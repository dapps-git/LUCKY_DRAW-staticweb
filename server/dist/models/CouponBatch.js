import mongoose, { Schema } from 'mongoose';
const CouponBatchSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    count: { type: Number, required: true },
    startId: { type: String, required: true },
    endId: { type: String, required: true },
    createdAt: { type: String, required: true },
    unusedCount: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
}, {
    timestamps: true,
});
export const CouponBatch = mongoose.model('CouponBatch', CouponBatchSchema);
