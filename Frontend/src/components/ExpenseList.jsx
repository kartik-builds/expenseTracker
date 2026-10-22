const ExpenseList = ({ expenses, onExpenseDeleted, onEdit }) => {
    const handleDelete =  async (id)=>{
        try{
            const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
                method: 'DELETE',
            })
            if(!response.ok){
                throw new Error('Failed to delete expense')
            }
            const data = await response.json()
            console.log('Expense deleted successfully:', data)
            onExpenseDeleted(id)
        }
        catch(error){
            console.error('Error deleting expense:', error)
        }
    }
    return (
        <div>
            <h1>Expense List</h1>
            {expenses.length === 0 ? (
                <p>No expenses found.</p>
            ) : (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {expenses.map((expense) => (
                        <li key={expense._id}>
                            <p>Category: {expense.category}</p>
                            <p>Description: {expense.description}</p>
                            <p>Date: {expense.date}</p>
                            <p>Amount: {expense.amount}</p>
                            <button onClick={() => handleDelete(expense._id)}>Delete</button>
                            <button onClick={() => onEdit(expense)}>Edit</button>    
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
export default ExpenseList