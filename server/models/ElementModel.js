// models/ElementModel.js
import mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
  element: { type: String, required: true },        // e.g., "Data Annotation", "Pre-Processing"
  datasetName: { type: String, required: true },    // The selected dataset
  used: { type: String, default: 'No' },            // Indicates if the element is used (default "No")
  createdAt: { type: Date, default: Date.now },     // Date when the element was created
});

const ElementModel = mongoose.model('Element', elementSchema);
export default ElementModel;
