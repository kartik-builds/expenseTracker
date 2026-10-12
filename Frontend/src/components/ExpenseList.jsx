const ExpenseList = ({ expenses }) => {
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
export default ExpenseList