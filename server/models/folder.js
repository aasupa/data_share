import mongoose from "mongoose";
const folderSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdByUsername: { type: String, required: true },
  });
  
  const Folder = mongoose.model('Folder', folderSchema);
  export default Folder;