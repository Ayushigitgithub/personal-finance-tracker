import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [transactions, setTransactions] = useState([
    { date: '2024-07-15', type: 'income', amount: 500 },
    { date: '2024-07-14', type: 'expense', amount: 200 },
    { date: '2024-07-13', type: 'income', amount: 1000 },
  ]);

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/transaction',
        { amount, type, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const data = {
    labels: transactions.map(t => t.date),
    datasets: [
      {
        label: 'Income',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
        data: transactions.filter(t => t.type === 'income').map(t => t.amount),
      },
      {
        label: 'Expense',
        backgroundColor: 'rgba(255,99,132,1)',
        borderColor: 'rgba(255,99,132,1)',
        data: transactions.filter(t => t.type === 'expense').map(t => t.amount),
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="summary-cards">
        <div className="card">
          <h2>Total Income</h2>
          <p>${totalIncome}</p>
        </div>
        <div className="card">
          <h2>Total Expense</h2>
          <p>${totalExpense}</p>
        </div>
        <div className="card">
          <h2>Balance</h2>
          <p>${balance}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label>Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button type="submit">Add Transaction</button>
      </form>
      <div className="chart-container">
        <h2>Transactions</h2>
        <Bar data={data} />
      </div>
      <div>
        <h2>Transaction List</h2>
        <ul className="transaction-list">
          {transactions.map((t: any, index: number) => (
            <li key={index} className="transaction-item">
              {t.date}: {t.type} - ${t.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

export {};


  
  