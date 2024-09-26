import express from 'express';
import { getDatasetById, getAllDatasetIds, uploadDataset, updateDataset } from '../controller/datasetController.js';



const router = express.Router();


// API to get a dataset by its ID
router.get('/dataset/:datasetId', getDatasetById);
router.get('/datasets/ids', getAllDatasetIds);

export default router;
