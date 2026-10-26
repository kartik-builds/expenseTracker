import mongoose from "mongoose";
const expenseSchema = new mongoose.Schema({
    category : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        required : true,
        min : 0.01
    },
    date : {
        type : Date,
        default : Date.now
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
}
})
const Expense = mongoose.model("Expense",expenseSchema)
export default Expense