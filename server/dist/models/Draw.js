import mongoose, { Schema } from 'mongoose';
const DrawSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    number: { type: Number, required: true },
    date: { type: String, required: true },
    prizeId: { type: String, required: true },
    winnerCount: { type: Number, default: 1 },
    status: { type: String, enum: ['Upcoming', 'Completed'], default: 'Upcoming' },
}, {
    timestamps: true,
});
export const Draw = mongoose.model('Draw', DrawSchema);
