const mongoose = require('mongoose');

const PointsHistorySchema = new mongoose.Schema({
  points: { type: Number, required: true },
  note: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
}, { _id: false });

const KidsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
  history: { type: [PointsHistorySchema], default: [] },
});

module.exports = mongoose.model('Kids', KidsSchema);
