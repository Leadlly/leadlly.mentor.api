import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	message: { type: String, required: true },
	url: [{ type: String }],
	isRead: { type: Boolean, default: false },
	option: { type: String },
	createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model('Notification', notificationSchema);
