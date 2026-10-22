import { useState, useEffect } from "react"

const ExpenseForm = ({ onExpenseAdded, editingExpense, onCancelEdit }) => {
    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0]
    }
    const [expense, setExpense] = useState({
        category: "",
        amount: "",
        date: getTodayDate(),
        description: "",
        customCategory: ""
    })

    const handleSubmit = async (event) => {
        event.preventDefault()
        const finalExpense = {
            ...expense,
            category: expense.category === "Other"
                ? expense.customCategory
                : expense.category
        };
        try {
            const response = await fetch(
                editingExpense
                    ? `http://localhost:3000/api/expenses/${editingExpense._id}`
                    : 'http://localhost:3000/api/expenses',
                {
                    method: editingExpense ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(finalExpense)
                }
            );
            if (!response.ok) {
                throw new Error('Failed to add expense')
            }
            const data = await response.json()
            console.log('Expense added successfully:', data)
            if (expense.category === "Other") {
                setExpense(prev => ({ ...prev, customCategory: "" }))
            }
            setExpense({
                category: "",
                amount: "",
                date: getTodayDate(),
                description: "",
                customCategory: ""
            });
            onExpenseAdded()
            if (editingExpense) {
                onCancelEdit()
            }
        }
        catch (error) {
            console.error('Error adding expense:', error)
        }
    }
    useEffect(() => {
        if (editingExpense) {
            setExpense({
                category: editingExpense.category,
                amount: editingExpense.amount,
                date: new Date(editingExpense.date).toISOString().split('T')[0],
                description: editingExpense.description,
                customCategory: editingExpense.customCategory || ""
            });
        } else {
            setExpense({
                category: "",         
                amount: "",
                date: getTodayDate(),
                description: "",
                customCategory: ""
            });
        }
    }, [editingExpense]);
    return (
        <div>
            <h2>Add Expense</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="category">Category : </label>
                    <select id="category" value={expense.category} onChange={(event) => setExpense(prev => ({ ...prev, category: event.target.value }))} required>
                        <option value="" disabled hidden>Select Category</option>
                        <option value="Food">Food</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                {expense.category === "Other" && (
                    <div>
                        <label htmlFor="customCategory">Please Mention Your Category : </label>
                        <input id="customCategory" type="text" placeholder="Enter Category" required value={expense.customCategory} onChange={(event) => setExpense(prev => ({ ...prev, customCategory: event.target.value }))} />

                    </div>
                )}
                <div>
                    <label htmlFor="amount">Amount : </label>
                    <input id="amount" type="number" placeholder="Enter Amount" required value={expense.amount} min="0.01" step="0.01" onChange={(event) => setExpense(prev => ({ ...prev, amount: event.target.value }))} />
                </div>
                <div>
                    <label htmlFor="date">Date : </label>
                    <input id="date" type="date" placeholder="Enter Date" required value={expense.date} onChange={(event) => setExpense(prev => ({ ...prev, date: event.target.value }))} />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <input id="description" type="text" required value={expense.description} onChange={(event) => setExpense(prev => ({ ...prev, description: event.target.value }))} />
                </div>
                <button type="submit">
                    {editingExpense ? "Update Expense" : "Add Expense"}
                </button>        </form>
        </div>
    )
}
export default ExpenseForm