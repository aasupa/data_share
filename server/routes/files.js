import express from "express";
import {getTotalFiles} from "../controller/FileController.js";
 

const router = express.Router();


router.get('/total-files', getTotalFiles);


export default router;