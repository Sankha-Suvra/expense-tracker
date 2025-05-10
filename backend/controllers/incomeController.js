import Income from "../models/Income.js";
import xlsx from 'xlsx'

export const addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        if(!source || !amount || !date) return res.status(400).json({ message: "all the fields are required" });

        const newIncome = await Income.create({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });
        res.status(200).json(newIncome);

    } catch (error) {
        res.status(500).json({ message: "Error adding income", error: error.message });
    }
}
export const getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try{
        const income = await Income.findAll({
            where:{
                userId: userId
            },
            order:[
                ['date', 'DESC']
            ]
        })
        res.json(income)
        
    }catch(error){
        res.status(500).json({ message: "Error getting income", error: error.message });
    }

}
export const deleteIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const incomeToDelete = await Income.findByPk(req.params.id)

        if(!incomeToDelete) return res.status(404).json({ message: "Income not found" });

        if(incomeToDelete.userId !== userId) return res.status(403).json({ message: "You are not authorized to delete this income" })

        await incomeToDelete.destroy();
        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting income", error: error.message });
    }
}
export const downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.findAll({
            where:{
                userId: userId
            },
            order:[
                ['date', 'DESC']
            ]
        })
        
        const data = income.map((item)=>({
            Source: item.source,
            Amount: item.amount,
            Date: item.date
        }))

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Income');
        xlsx.writeFile(wb, 'income_details.xlsx')
        res.download('income_details.xlsx')

    } catch (error) {   
        res.status(500).json({ message: "Error downloading income", error: error.message });
    }

}

