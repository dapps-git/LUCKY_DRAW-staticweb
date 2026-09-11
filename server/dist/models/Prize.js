import mongoose, { Schema } from 'mongoose';
const PrizeSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    value: { type: String, required: true },
    image: { type: String, required: true },
    assignedDrawId: { type: String },
    status: { type: String, enum: ['Unassigned', 'Assigned', 'Awarded'], default: 'Unassigned' },
}, {
    timestamps: true,
});
export const Prize = mongoose.model('Prize', PrizeSchema);
