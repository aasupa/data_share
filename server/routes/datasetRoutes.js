// import express from 'express';
// import { getDatasetById, getAllDatasetIds, uploadDataset, updateDataset } from '../controller/datasetController.js';



// const router = express.Router();


// // API to get a dataset by its ID
// router.get('/dataset/:datasetId', getDatasetById);
// router.get('/datasets/ids', getAllDatasetIds);

// export default router;
import express from 'express';
import { getAllFilesFromS3, getFileFromS3, generateS3FileURL } from '../controller/datasetController.js';

const router = express.Router();

// Route to get all files from the S3 bucket
router.get('/datasets/s3/files', getAllFilesFromS3);

// Route to get a specific file from S3 by filename
router.get('/datasets/s3/files/:filename', getFileFromS3);

// Route to generate a signed URL for accessing a file from S3
router.get('/datasets/s3/file-url/:filename', generateS3FileURL);

export default router;
