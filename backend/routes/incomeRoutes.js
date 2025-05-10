import express from "express";
import cors from "cors";

import {
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel
} from "../controllers/incomeController.js"

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/add', protect, addIncome);
router.get('/all', protect, getAllIncome);
router.get('/downloadexcel', protect, downloadIncomeExcel);
router.delete('/delete/:id', protect, deleteIncome);

export default router