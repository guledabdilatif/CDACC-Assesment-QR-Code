const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
  },
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', RecordSchema, 'qr-codes');