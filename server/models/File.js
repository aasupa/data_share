import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder', // Link file to a specific folder
      default: null, // Files can exist without a folder (root folder)
    }, 
  });
  const File = mongoose.model("File", FileSchema);
  export default File;