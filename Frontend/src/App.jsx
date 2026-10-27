import "./App.css"
import ExpenseList from "./components/ExpenseList"
import { useState} from "react"
import ExpenseForm from "./components/ExpenseForm"
import Login from "./components/Login"
function App() {
  const [expenses, setExpenses] = useState([])
  const [editingExpense, setEditingExpense] = useState(null)
  const [user, setUser] = useState(null);
  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/expenses', {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error('Failed to fetch expenses')
      }
      const data = await response.json()
      setExpenses(data)
      console.log('Fetched expenses:', data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  return (
    <>
      {!user ? (
        <Login
          onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            fetchExpenses();
          }}
        />
      ) : (
        <>
          <h1>Expense Tracker</h1>

          <ExpenseForm
            onExpenseAdded={fetchExpenses}
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
          />

          <ExpenseList
            expenses={expenses}
            onExpenseDeleted={(id) => {
              setExpenses(prevExpenses =>
                prevExpenses.filter(
                  expense => expense._id !== id
                )
              );
            }}
            onEdit={(expense) => {
              setEditingExpense(expense);
            }}
          />
        </>
      )}
    </>
  );
}

export default App