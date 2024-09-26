// routes/elementRoutes.js
import express from 'express';
import { getCreatedElements, createElement } from '../controller/elementController.js';

const router = express.Router();

// Route to get all created elements (history)
router.get('/elements', getCreatedElements);

// Route to create a new element
router.post('/elements', createElement);

export default router;
