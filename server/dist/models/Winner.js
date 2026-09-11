import mongoose, { Schema } from 'mongoose';
const WinnerSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    drawId: { type: String, required: true, index: true },
    participantId: { type: String, required: true, index: true },
    prizeId: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['Confirmed'], default: 'Confirmed' },
}, {
    timestamps: true,
});
export const Winner = mongoose.model('Winner', WinnerSchema);
