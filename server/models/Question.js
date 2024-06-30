const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a question
const QuestionSchema = new Schema({
  type: {
    type: String,
    enum: ['short', 'mcq'],
    required: true
  },
  q: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    default: ['']
  }
});

// Define the schema for the question set form
const QuestionSetSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  productDescription: {
    type: String,
    required: true
  },
  productImageUrl: {
    type: String,
    required: true
  },
  isOrderIdTracking: {
    type: Boolean,
    required: true
  },
  reviewDate: {
    type: Date
  },
  excelFile: {
    type: String
  },
  questions: [QuestionSchema]
});

const QuestionSet = mongoose.model('QuestionSet', QuestionSetSchema);
module.exports = QuestionSet;
