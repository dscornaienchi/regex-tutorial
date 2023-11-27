const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reactionSchema = new Schema({
  reactionId: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  reactionBody: { type: String, required: true, maxlength: 280 },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, get: (createdAt) => dateFormat(createdAt) }
});

const thoughtSchema = new Schema({
  thoughtText: { type: String, required: true, maxlength: 280 },
  createdAt: { type: Date, default: Date.now, get: (createdAt) => dateFormat(createdAt) },
  username: { type: String, required: true },
  reactions: [reactionSchema]
});

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
