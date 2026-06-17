const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Kids = require('./models/kids.model');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://thomassedhom5_db_user:N0cUlcswImRltvJX@cluster0.b1sskgk.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.get('/admin', async (req, res) => {
  try {
    const children = await Kids.find().sort({ score: -1 }).exec();
    res.json(children.map(child => ({ name: child.name, score: child.score, history: child.history, _id: child._id })));
  } catch (err) {
    console.error('GET /admin error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/admin/addKid', async (req, res) => {
  const { name } = req.body;
  console.log('POST /admin/addKid', name);
  if (!name || name.trim() === '') return res.status(400).json({ error: 'Kid name is required' });
  const safeName = name.trim();
  const escapeRegex = s => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
  try {
    const existing = await Kids.findOne({ name: { $regex: new RegExp(`^${escapeRegex(safeName)}$`, 'i') } }).exec();
    if (existing) return res.status(400).json({ error: 'A kid with this name already exists' });
    const created = await Kids.create({ name: safeName });
    res.json(created);
  } catch (err) {
    console.error('POST /admin/addKid error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/admin/:id', async (req, res) => {
  const { id } = req.params;
  const { score, note } = req.body;
  console.log('POST /admin/:id', id, score, note);
  if (!note || note.trim() === '') return res.status(400).json({ error: 'Note is required when updating points' });
  try {
    const child = await Kids.findById(id).exec();
    if (!child) return res.status(404).json({ error: 'Child not found' });
    child.score += Number(score || 0);
    child.history.push({ points: Number(score || 0), note: note.trim(), date: new Date() });
    await child.save();
    res.json({ message: 'Child score updated successfully', score: child.score, history: child.history });
  } catch (err) {
    console.error('POST /admin/:id error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Simple server listening on ${port}`));
