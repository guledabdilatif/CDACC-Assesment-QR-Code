const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const mongoose = require('mongoose'); // This fixes the 'ReferenceError'

// Define the Schema for the "File" where all submitted data will go
const submissionSchema = new mongoose.Schema({
  centerName: String,
  serialNo: String,
  courseName: String,
  level: String,
  unitCode: String,
  unitName: String,
  totalTools: Number,
  c1name: String,
  c1reg: String,
  c2name: String,
  c2reg: String,
  headName: String,
  supervisorName: String,
  submittedAt: { type: Date, default: Date.now }
}, { strict: false }); // 'strict: false' ensures all data from the frontend is saved

// Create the Model
const Submission = mongoose.model('Submission', submissionSchema);

// THE SUBMISSION ROUTE
// This is called when you click the button on http://localhost:5173/record/:id
router.post('/submissions', async (req, res) => {
  try {
    const newSubmission = new Submission(req.body);
    await newSubmission.save();
    res.status(201).json({ message: "Submitted successfully" });
  } catch (error) {
    // 11000 is the MongoDB code for "Duplicate Key"
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate record", 
        code: 11000 
      });
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// This is the GET route the Dashboard needs to download the Excel
router.get('/submissions', async (req, res) => {
  try {
    // Find everything in the Submissions collection
    const submissions = await Submission.find({}); 
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Export the router
module.exports = router;
// 1. CREATE: Add a new record (POST)
router.post('/qr', async (req, res) => {
  try {
    const newRecord = new Record(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(400).json({ message: "Error creating record", error });
  }
});

// 2. READ: Get all records (GET)
router.get('/qr', async (req, res) => {
  try {
    const records = await Record.find().sort({ dateCreated: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching records", error });
  }
});

// 3. READ: Get a single record by ID (GET)
// This is what the useEffect on your frontend uses to fill the form
router.get('/qr/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: "Error fetching record", error });
  }
});

// 4. UPDATE: Update a record by ID (PUT)
router.put('/qr/:id', async (req, res) => {
  try {
    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Returns the modified document
    );
    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({ message: "Error updating record", error });
  }
});

// 5. DELETE: Remove a record (DELETE)
router.delete('/qr/:id', async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record", error });
  }
});

module.exports = router;