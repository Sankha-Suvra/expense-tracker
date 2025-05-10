import express from "express";
import cors from "cors";
import path from "path";
import { dirname } from "path";
import dotenv from "dotenv";
import {dbConnect} from "./config/db.js";
import authRoutes from './routes/authRoutes.js'
import { fileURLToPath } from "url";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/income', incomeRoutes)
app.use('/api/v1/expense', expenseRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)




// server upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error)
  }
}
start()


  