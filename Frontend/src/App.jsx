import "./App.css"
import ExpenseList from "./components/ExpenseList"
import { useState, useEffect } from "react"
import ExpenseForm from "./components/ExpenseForm"
function App() {
  const [expenses, setExpenses] = useState([])

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/expenses')
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
  useEffect(() => {
    fetchExpenses()
  }, [])
  return (
    <>
      <h1>Expense Tracker</h1>
      <ExpenseForm onExpenseAdded={fetchExpenses} />
      <ExpenseList
        expenses={expenses}
        onExpenseDeleted={(id) => {
          setExpenses(prevExpenses =>
            prevExpenses.filter(expense => expense._id !== id)
          );
        }}
      />
    </>
  )
}
export default App