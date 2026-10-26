import express from "express";
import requireAuth from "./middleware/requireAuth.js";
import session from "express-session";
import MongoStore from "connect-mongo"
import authRoutes from "./routes/authRoutes.js"
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv"
import Expense from "./models/Expense.js";
const app = express()
const port = 3000
dotenv.config()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials : true //Frontend and Backend run on different ports. When we use cookies for authentication, the browser needs permission to send credentials with cross-origin requests.
}))
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    store : MongoStore.create({
        mongoUrl : process.env.MongoDB_URI
    }),
    cookie : {
        httpOnly : true,
        secure : false,
        sameSite : "lax",
        maxAge : 1000*60*60*24
    }
}))
app.use("/api/auth", authRoutes);
mongoose.connect(process.env.MongoDB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error : ", err))


app.get("/api/expenses", requireAuth ,async (req, res) => {
    try {
        const expenses = await Expense.find()
        res.status(200).json(expenses)
    }
    catch (err) {
        console.error("Error fetching expenses : ", err)
        return res.status(500).json({ message: "Internal server error" })
    }
})
app.post("/api/expenses", requireAuth,async (req, res) => {
    try {
        const { category, description, amount, date } = req.body
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
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Invalid Entry" })
        }
        else {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
})
app.put("/api/expenses/:id", requireAuth ,async (req, res) => {
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
app.delete("/api/expenses/:id", requireAuth,async (req, res) => {
    try {
        const deleteExpense = await Expense.findByIdAndDelete(req.params.id)
        if (!deleteExpense) {
            return res.status(404).json({ message: "Expense not Found" })
        }
        res.status(200).json({ message: "Expense Deleted Successfully" })
    }
    catch (err) {
        console.error("Error deleting expense : ", err)
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid Id" })
        }
        else {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
})


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})