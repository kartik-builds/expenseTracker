import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import Expense from "./models/Expense.js";
const app = express()
const port = 3000
app.use(express.json())
dotenv.config()
mongoose.connect(process.env.MongoDB_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error : ", err))
app.get("/api/expenses", async (req, res) => {
    try {
        const expenses = await Expense.find()
        res.status(200).json(expenses)
    }
    catch (err) {
        console.error("Error fetching expenses : ", err)
        return res.status(500).json({ message: "Internal server error" })
    } 
})
app.post("/api/expenses", async (req, res) => {
    try {
        const {category , description , amount , date } = req.body
        const newExpense = await Expense.create({
            category,
            description,
            amount,
            date
        })
        res.status(201).json(newExpense)
    }
    catch (err) {
        console.error("Error adding expense : ", err)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})
app.put("/api/expenses/:id", async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" })
        }
        res.status(200).json({ message: "Expense Updated Successfully : ", updatedExpense })
    }
    catch (err) {
        console.error("Error updating the expense : ", err)
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Invalid Entry" })
        }
        else {
            return res.status(500).json({ message: "Internal server error" })
        }
    }
})
app.delete("/api/expenses/:id", async (req,res)=>{
    try{
        const deleteExpense = await Expense.findByIdAndDelete(req.params.id)
        if(!deleteExpense){
            return res.status(404).json({message : "Expense not Found"})
        }
        res.status(200).json({message : "Expense Deleted Successfully"})
    }
    catch(err){
        console.error("Error deleting expense : ",err)
        if(err.name === CastError){
            return res.status(400).json({message : "Invalid Id"})
        }
        else {
            return res.status(500).json({message : "Internal Server Error"})
        }
    }
})







app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})