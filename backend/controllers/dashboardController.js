import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import { DATE, Op } from "sequelize";

export const getDashboardData = async (req, res)=>{
    try {
        const userId = req.user.id

        const totalIncome = await Income.sum('amount',{
            where:{
                userId: userId
            }
        })
        console.log("totalIncome: ", totalIncome);
        
        const totalExpense = await Expense.sum('amount',{
            where:{
                userId: userId
            }
        })
        console.log("totalExpense: ", totalExpense);
        
        //last 60 days income trans
        const sixtyDaysAgo = new Date()
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
        
        const last60DaysIncomeTransactions = await Income.findAll({
            where:{
                userId: userId,
                createdAt:{
                    [Op.gte]: sixtyDaysAgo
                }
            },
            order: [['createdAt', 'DESC']]
        })
        
        const totalIncomeLast60Days = last60DaysIncomeTransactions
        .map(transaction => transaction.amount)
        .reduce(
            (total, amount) => total + amount,
            0
        )

         //last 30 days expense trans
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const last30DaysExpenseTransactions = await Expense.findAll({
            where:{
                userId: userId,
                createdAt:{
                    [Op.gte]: thirtyDaysAgo
                }
            },
            order: [['createdAt', 'DESC']]
        })
        
        const totalExpenseLast30Days = last30DaysExpenseTransactions
        .map(transaction => transaction.amount)
        .reduce(
            (total, amount) => total + amount,
            0
        )

        //Last five transactions
        const lastFiveIncome = await Income.findAll({
            where: {
                userId: userId
            },
            order: [['createdAt', 'DESC']],
            limit: 5
        });
        const lastFiveExpense = await Expense.findAll({
            where: {
                userId: userId
            },
            order: [['createdAt', 'DESC']],
            limit: 5
        });
            //merging and sorting both
        const lastFiveTransactions = [
            ...lastFiveIncome.map(txn =>({
                ...txn.dataValues,
                type: 'income' 
            })),
            ...lastFiveExpense.map(txn =>({
                ...txn.dataValues,
                type: 'expense' 
            }))

        ].sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)) 

        //final response
        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome:  totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: totalExpenseLast30Days,
                transactions: last30DaysExpenseTransactions
                },
            last60DaysIncome: {
                total: totalIncomeLast60Days,
                transactions: last60DaysIncomeTransactions
                },
            recentTransactions: lastFiveTransactions
        })
    
    } catch (error) {
        res.status(500).json({ message: "Error getting dashboard data", error: error.message });
    }
}
