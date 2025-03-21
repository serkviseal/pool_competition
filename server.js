import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Group from './models/Group.js';

dotenv.config();

const app = express();
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in your .env file');
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// GET endpoint to retrieve groups data from MongoDB
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await Group.find({});
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// POST endpoint to update groups data in MongoDB
app.post('/api/groups', async (req, res) => {
  try {
    // Ensure req.body is treated as an array
    const groupsInput = Array.isArray(req.body) ? req.body : [req.body];

    // Clear existing groups and remove _id from each incoming group
    await Group.deleteMany({});
    const groupsToInsert = groupsInput.map(group => {
      const { _id, ...rest } = group;
      return rest;
    });
    
    await Group.insertMany(groupsToInsert);
    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving groups:', error);
    res.status(500).json({ error: 'Failed to save groups' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
