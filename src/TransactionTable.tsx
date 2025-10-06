// src/components/TransactionTable.tsx
import React from "react";
import { useWallet } from "../src/context/WalletContext";

const TransactionTable: React.FC = () => {
  const { transactions } = useWallet();

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-3">📜 Transaction History</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Sender</th>
            <th className="p-2 border">Receiver</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50">
              <td className="p-2 border">{new Date(tx.date).toLocaleString()}</td>
              <td className="p-2 border">{tx.type}</td>
              <td className="p-2 border">${tx.amount}</td>
              <td className="p-2 border">{tx.sender || "-"}</td>
              <td className="p-2 border">{tx.receiver || "-"}</td>
              <td className={`p-2 border font-medium ${tx.status === "completed" ? "text-green-600" : "text-red-600"}`}>
                {tx.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
