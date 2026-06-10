import mongoose, { Schema } from 'mongoose';

const supportTicketSchema = new Schema({
  ticketNumber: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  category: {
    type: String,
    enum: ['Order', 'Payment', 'Vendor', 'Product', 'General'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true
});

supportTicketSchema.index({ user: 1 });
supportTicketSchema.index({ status: 1 });

const supportReplySchema = new Schema({
  ticket: { type: Schema.Types.ObjectId, ref: 'SupportTicket', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  attachments: [{ type: String }]
}, {
  timestamps: true
});

supportReplySchema.index({ ticket: 1 });

export const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
export const SupportReply = mongoose.model('SupportReply', supportReplySchema);
