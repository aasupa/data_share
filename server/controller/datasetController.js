
// import Dataset from '../models/dataset.js';
// import fs from 'fs';
// import path from 'path';

// // Generate a random number with the specified length (default is 4)
// const generateRandomNumber = (length = 4) => {
//   return Math.floor(Math.random() * Math.pow(10, length));
// };

// // API to get dataset by ID
// export const getDatasetById = async (req, res) => {
//   const { datasetId } = req.params;
//   try {
//     const dataset = await Dataset.findOne({ datasetId });
//     if (!dataset) {
//       return res.status(404).json({ message: 'Dataset not found' });
//     }
//     res.status(200).json(dataset);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // API to get all dataset IDs
// export const getAllDatasetIds = async (req, res) => {
//   try {
//     const datasets = await Dataset.find({}, { datasetId: 1 });
//     res.status(200).json(datasets);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // API to upload new dataset
// export const uploadDataset = async (req, res) => {
//   try {
//     const jsonFile = req.file;

//     if (!jsonFile) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const fileData = fs.readFileSync(jsonFile.path, 'utf8');
//     const jsonData = JSON.parse(fileData);

//     const randomNumber = generateRandomNumber();
//     const originalFilename = path.basename(jsonFile.originalname, path.extname(jsonFile.originalname));
//     const datasetId = `${randomNumber}_${originalFilename}`;

//     // Create a new dataset
//     const newDataset = new Dataset({
//       datasetId,       
//       data: jsonData  
//     });

//     await newDataset.save();
//     res.status(201).json({ message: 'Dataset uploaded successfully', dataset: newDataset });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const updateDataset = async (req, res) => {
//   const { datasetId } = req.params;

//   try {
//     const updatedData = req.body.data; // Get updated data from the request body

//     const existingDataset = await Dataset.findOne({ datasetId });

//     if (!existingDataset) {
//       return res.status(404).json({ message: 'Dataset not found' });
//     }

//     // Update the dataset with new data
//     existingDataset.data = updatedData;
//     await existingDataset.save();

//     res.status(200).json({ message: 'Dataset updated successfully', dataset: existingDataset });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


import Dataset from '../models/dataset.js';
import fs from 'fs';
import path from 'path';

// Generate a random number with the specified length (default is 4)
const generateRandomNumber = (length = 4) => {
  return Math.floor(Math.random() * Math.pow(10, length));
};

// API to get dataset by ID
export const getDatasetById = async (req, res) => {
  const { datasetId } = req.params;
  try {
    const dataset = await Dataset.findOne({ datasetId });
    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    res.status(200).json(dataset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// API to get all dataset IDs
export const getAllDatasetIds = async (req, res) => {
  try {
    const datasets = await Dataset.find({}, { datasetId: 1 });
    res.status(200).json(datasets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// API to upload new dataset
export const uploadDataset = async (req, res) => {
  try {
    const jsonFile = req.file;

    if (!jsonFile) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileData = fs.readFileSync(jsonFile.path, 'utf8');
    const jsonData = JSON.parse(fileData);

    const randomNumber = generateRandomNumber();
    const originalFilename = path.basename(jsonFile.originalname, path.extname(jsonFile.originalname));
    const datasetId = `${randomNumber}_${originalFilename}`;

    // Create a new dataset
    const newDataset = new Dataset({
      datasetId,
      data: jsonData
    });

    await newDataset.save();
    res.status(201).json({ message: 'Dataset uploaded successfully', dataset: newDataset });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDataset = async (req, res) => {
  const { datasetId } = req.params;

  try {
    const updatedData = req.body.data; // This should include all new and existing rows with new columns

    // Find the existing dataset
    const existingDataset = await Dataset.findOne({ datasetId });

    if (!existingDataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Update each row of the dataset while preserving existing data
    const updatedRows = existingDataset.data.map((row, index) => {
      return {
        ...row, // Preserve existing data for this row
        ...updatedData[index], // Update with new values for this row (if any)
      };
    });

    // Update the dataset with the new rows
    existingDataset.data = updatedRows;

    // Save the updated dataset
    await existingDataset.save();

    res.status(200).json({ message: 'Dataset updated successfully', dataset: existingDataset });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
