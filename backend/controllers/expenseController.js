
import Expense from "../models/Expense.js";
import xlsx from 'xlsx'

export const addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        if(!category || !amount || !date) return res.status(400).json({ message: "all the fields are required" });

        const newExpense = await Expense.create({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });
        res.status(200).json(newExpense);

    } catch (error) {
        res.status(500).json({ message: "Error adding expense", error: error.message });
    }
}
export const getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try{
        const expense = await Expense.findAll({
            where:{
                userId: userId
            },
            order:[
                ['date', 'DESC']
            ]
        })
        res.json(expense)
        
    }catch(error){
        res.status(500).json({ message: "Error getting expense", error: error.message });
    }

}
export const deleteExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const ExpenseToDelete = await Expense.findByPk(req.params.id)

        if(!ExpenseToDelete) return res.status(404).json({ message: "expense not found" });

        if(ExpenseToDelete.userId !== userId) return res.status(403).json({ message: "You are not authorized to delete this expense" })

        await ExpenseToDelete.destroy();
        res.json({ message: "expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting expense", error: error.message });
    }
}
export const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.findAll({
            where:{
                userId: userId
            },
            order:[
                ['date', 'DESC']
            ]
        })
        
        const data = expense.map((item)=>({
            Source: item.source,
            Amount: item.amount,
            Date: item.date
        }))

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Expense');
        xlsx.writeFile(wb, 'expense_details.xlsx')
        res.download('expense_details.xlsx')

    } catch (error) {   
        res.status(500).json({ message: "Error downloading expense", error: error.message });
    }

}
