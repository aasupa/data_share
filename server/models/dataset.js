import mongoose from 'mongoose';

const DatasetSchema = new mongoose.Schema({
  datasetId: { type: String, required: true, unique:true },  // Unique identifier for each dataset
  data: { type: Array, required: true },        // Store the actual JSON data (array of objects)
}, {timestamps: true});

const Dataset = mongoose.model('Dataset', DatasetSchema);
export default Dataset;
