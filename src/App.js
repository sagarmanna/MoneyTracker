import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transaction';
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      return await response.json();
    } catch (err) {
      console.error("❌ GET error:", err.message);
      return [];
    }
  }

  function addNewTransaction(event) {
    event.preventDefault();
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      alert("❌ Enter a valid amount");
      return;
    }

    const url = process.env.REACT_APP_API_URL + '/transaction';

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: parsedPrice,
        name,
        description,
        datetime: dateTime
      })
    })
    .then(res => res.json())
    .then(json => {
      console.log("✅ Added:", json);
      setPrice("");
      setName("");
      setDateTime("");
      setDescription("");
      getTransactions().then(setTransactions);
    })
    .catch(err => console.error("❌ POST error:", err.message));
  }

  const balance = transactions.reduce((acc, tx) => acc + tx.price, 0);

  return (
    <main>
      <h1>Balance: ₹{balance.toLocaleString('en-IN')}</h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Amount" required />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Title" required />
          <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
        </div>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <button>➕ Add Transaction</button>
      </form>

      <div className="transactions">
        {[...transactions].reverse().map((transaction, i) => (
          <div key={i} className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price " + (transaction.price < 0 ? "red" : "green")}>₹{transaction.price}</div>
              <div className="datetime">{new Date(transaction.datetime).toLocaleString('en-IN')}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
