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


//Health Check Routes

app.get('/', (req, res) => {
  res.send('✅ Expense Tracker API is running');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

//Demo Routes START------

app.get('/api/v1/demo/income', (req, res) => {
  res.json({
    income: [
      { id: 1, source: 'Salary', amount: 5000, date: '2025-04-01' },
    ]
  });
});

app.get('/api/v1/demo/expense', (req, res) => {
  res.json({
    expenses: [
      { id: 1, category: 'Food', amount: 300, date: '2025-04-01' },
      { id: 2, category: 'Transport', amount: 150, date: '2025-04-02' },
    ],
  });
});

app.get('/api/v1/mock-public-dashboard', (req, res) => {
  // Define a mock "current date" for consistent relative dates in the mock data
  // Let's assume "today" for the mock data is July 16, 2025
  const todayForMock = new Date('2025-07-16T10:00:00Z');

  const mockExpensesList = [
    { id: 'exp1', userId: 'mockUserPublic', description: 'Dinner with friends', amount: 75, category: 'Food', date: '2025-07-15T19:00:00Z', createdAt: '2025-07-15T19:00:00Z', updatedAt: '2025-07-15T19:00:00Z' },
    { id: 'exp2', userId: 'mockUserPublic', description: 'Monthly Metro Pass', amount: 120, category: 'Transport', date: '2025-07-01T08:00:00Z', createdAt: '2025-07-01T08:00:00Z', updatedAt: '2025-07-01T08:00:00Z' },
    { id: 'exp3', userId: 'mockUserPublic', description: 'New Headphones', amount: 150, category: 'Electronics', date: '2025-06-20T11:00:00Z', createdAt: '2025-06-20T11:00:00Z', updatedAt: '2025-06-20T11:00:00Z' },
    { id: 'exp4', userId: 'mockUserPublic', description: 'Coffee', amount: 5, category: 'Food', date: '2025-06-10T09:00:00Z', createdAt: '2025-06-10T09:00:00Z', updatedAt: '2025-06-10T09:00:00Z' }, // Older expense
  ];

  const mockIncomesList = [
    { id: 'inc1', userId: 'mockUserPublic', description: 'July Salary', amount: 5200, source: 'Work', date: '2025-07-01T09:00:00Z', createdAt: '2025-07-01T09:00:00Z', updatedAt: '2025-07-01T09:00:00Z' },
    { id: 'inc2', userId: 'mockUserPublic', description: 'Freelance Web Design', amount: 800, source: 'Side Hustle', date: '2025-06-25T14:00:00Z', createdAt: '2025-06-25T14:00:00Z', updatedAt: '2025-06-25T14:00:00Z' },
    { id: 'inc3', userId: 'mockUserPublic', description: 'June Salary', amount: 5150, source: 'Work', date: '2025-06-01T09:00:00Z', createdAt: '2025-06-01T09:00:00Z', updatedAt: '2025-06-01T09:00:00Z' }, // Older income
  ];

  // Filter for last 30 days (relative to `todayForMock`)
  const thirtyDaysAgo = new Date(todayForMock);
  thirtyDaysAgo.setDate(todayForMock.getDate() - 30);

  const last30DaysExpenseTransactions = mockExpensesList.filter(
    exp => new Date(exp.createdAt) >= thirtyDaysAgo // Using createdAt as per dashboardController logic
  );
  const totalExpenseLast30Days = last30DaysExpenseTransactions.reduce((sum, exp) => sum + exp.amount, 0);

  // Filter for last 60 days (relative to `todayForMock`)
  const sixtyDaysAgo = new Date(todayForMock);
  sixtyDaysAgo.setDate(todayForMock.getDate() - 60);

  const last60DaysIncomeTransactions = mockIncomesList.filter(
    inc => new Date(inc.createdAt) >= sixtyDaysAgo // Using createdAt
  );
  const totalIncomeLast60Days = last60DaysIncomeTransactions.reduce((sum, inc) => sum + inc.amount, 0);

  // Combining and sorting for recent transactions (using createdAt for sorting as in dashboardController)
  const allMockTransactions = [
    ...mockExpensesList.map(txn => ({ ...txn, type: 'expense' })),
    ...mockIncomesList.map(txn => ({ ...txn, type: 'income' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    totalBalance: 11150 - 350, 
    totalIncome:  12500,        
    totalExpense: 350,       
    last30DaysExpenses: {
        total: totalExpenseLast30Days,
        transactions: last30DaysExpenseTransactions
    },
    last60DaysIncome: {
        total: totalIncomeLast60Days,
        transactions: last60DaysIncomeTransactions
    },
    recentTransactions: allMockTransactions.slice(0, 5) // Last 5 transactions
  });
});

// Demo Routes END-----


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


  