import express from 'express';
import { getDatasetById, getAllDatasetIds, uploadDataset, updateDataset } from '../controller/datasetController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();


// API to get a dataset by its ID
router.get('/dataset/:datasetId', getDatasetById);
router.get('/datasets/ids', getAllDatasetIds);
router.post('/dataset/upload-dataset',upload.single('dataset'), uploadDataset);
router.put('/dataset/update-dataset/:datasetId', upload.single('dataset'), updateDataset);
export default router;
