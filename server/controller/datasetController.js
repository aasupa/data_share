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
//     const updatedData = req.body.data; // This should include all new and existing rows with new columns

//     // Find the existing dataset
//     const existingDataset = await Dataset.findOne({ datasetId });

//     if (!existingDataset) {
//       return res.status(404).json({ message: 'Dataset not found' });
//     }

//     // Update each row of the dataset while preserving existing data
//     const updatedRows = existingDataset.data.map((row, index) => {
//       return {
//         ...row, // Preserve existing data for this row
//         ...updatedData[index], // Update with new values for this row (if any)
//       };
//     });

//     // Update the dataset with the new rows
//     existingDataset.data = updatedRows;

//     // Save the updated dataset
//     await existingDataset.save();

//     res.status(200).json({ message: 'Dataset updated successfully', dataset: existingDataset });
    
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


import s3, { BUCKET_NAME } from '../utils/awsConfig.js';
import csv from 'csv-parser'; // Import the csv-parser library
import { Readable } from 'stream';
/**
 * Get all files from the S3 bucket
 */
export const getAllFilesFromS3 = async (req, res) => {
  const params = {
    Bucket: BUCKET_NAME,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    const files = data.Contents.map((file) => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
    })); // Extract file key, size, and last modified details

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a specific file by filename (key) from S3 bucket
 */
// export const getFileFromS3 = async (req, res) => {
//   const { filename } = req.params;

//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: filename,
//   };

//   try {
//     const data = await s3.getObject(params).promise();
//     const contentType = data.ContentType || 'application/octet-stream';
    
//     if (contentType === 'application/json') {
//       // If the content type is JSON, parse it
//       const fileContent = JSON.parse(data.Body.toString('utf-8'));
//       return res.status(200).json(fileContent);
//     } else if (contentType === 'text/csv' || filename.endsWith('.csv')) {
//       // If the content type is CSV or the filename ends with .csv, parse it
//       const results = [];
//       const stream = Readable.from(data.Body);

//       stream
//         .pipe(csv())
//         .on('data', (row) => results.push(row))
//         .on('end', () => {
//           return res.status(200).json(results); // Send the parsed CSV data
//         })
//         .on('error', (error) => {
//           console.error('Error parsing CSV:', error);
//           return res.status(500).json({ error: 'Error parsing CSV file.' });
//         });
//     } else {
//       return res.status(400).json({ error: 'Unsupported file format.' });
//     }
//   } catch (error) {
//     console.error('Error fetching file:', error);
//     res.status(500).json({ error: error.message });
//   }
// };


/**
 * Get a specific file by filename (key) from S3 bucket
 */
export const getFileFromS3 = async (req, res) => {
  const { filename } = req.params;

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
  };

  try {
    const data = await s3.getObject(params).promise();

    // Check the ContentType to verify it's a JSON file
    if (filename.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    } else if (filename.endsWith('.csv')) {
      res.setHeader('Content-Type', 'text/csv');
    } else {
      return res.status(400).json({ error: 'Unsupported file format.' });
    }

    res.send(data.Body); // Send the file content (file buffer)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate a signed URL for accessing files in S3
 */
export const generateS3FileURL = async (req, res) => {
  const { filename } = req.params;

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Expires: 60 * 60, // URL expires in 1 hour
  };

  try {
    const url = s3.getSignedUrl('getObject', params);
    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
