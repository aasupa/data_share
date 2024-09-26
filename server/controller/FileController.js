// FileController.js
import File from "../models/File.js"  // Assuming you have a File model

// Controller function to get total number of files
export const getTotalFiles = async (req, res) => {
    try {
      const fileCount = await File.countDocuments();  // MongoDB method to count documents
      res.status(200).json({ totalFiles: fileCount });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching total file count', error });
    }
  };