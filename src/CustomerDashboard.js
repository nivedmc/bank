// import { useState } from 'react';

// function CustomerDashboard() {
//   const [amount, setAmount] = useState(0);
//   const [transactionType, setTransactionType] = useState('deposit');

//   const handleTransaction = (e) => {
//     e.preventDefault();
//     // Implement logic to process the transaction based on the amount and transaction type
//     // For example, calling an API endpoint

//     console.log(`Transaction Type: ${transactionType}, Amount: ${amount}`);
//   };

//   return (
//     <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '100vh' }}>
//       <h1>User Dashboard</h1>
//       <form style={{ width: '300px' }} onSubmit={handleTransaction}>
//         <div className="mb-3">
//           <label htmlFor="amount" className="form-label">
//             Amount
//           </label>
//           <input
//             type="number"
//             className="form-control"
//             id="amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="transactionType" className="form-label">
//             Transaction Type
//           </label>
//           <select
//             className="form-select"
//             id="transactionType"
//             value={transactionType}
//             onChange={(e) => setTransactionType(e.target.value)}
//           >
//             <option value="deposit">Deposit</option>
//             <option value="withdrawal">Withdrawal</option>
//           </select>
//         </div>
//         <button type="submit" className="btn btn-primary w-100">
//           Confirm Transaction
//         </button>
//       </form>
//     </div>
//   );
// }

// export default CustomerDashboard;
