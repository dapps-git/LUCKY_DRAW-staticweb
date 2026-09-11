import mongoose, { Schema } from 'mongoose';
const ParticipantSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    couponId: { type: String, index: true },
    registeredAt: { type: String, required: true },
    eligibility: { type: String, enum: ['Eligible', 'Ineligible'], default: 'Eligible', index: true },
    status: { type: String, enum: ['Active', 'Suspended'], default: 'Active', index: true },
}, {
    timestamps: true,
    autoIndex: false,
});
export const Participant = mongoose.model('Participant', ParticipantSchema);
