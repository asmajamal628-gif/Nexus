// src/components/wallet/TransactionTable.tsx
import React from "react";
import { useWallet } from "../../context/WalletContext";

const TransactionTable: React.FC = () => {
  const { transactions } = useWallet();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-3">Transaction History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-gray-500">
            <tr>
              <th className="px-2 py-2">Date</th>
              <th className="px-2 py-2">Type</th>
              <th className="px-2 py-2">Amount</th>
              <th className="px-2 py-2">Sender</th>
              <th className="px-2 py-2">Receiver</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-2 py-2">{new Date(t.date).toLocaleString()}</td>
                <td className="px-2 py-2">{t.type}</td>
                <td className="px-2 py-2">${t.amount.toFixed(2)}</td>
                <td className="px-2 py-2">{t.sender ?? "-"}</td>
                <td className="px-2 py-2">{t.receiver ?? "-"}</td>
                <td className="px-2 py-2">
                  <span className={
                    t.status === "completed" ? "text-green-600" :
                    t.status === "pending" ? "text-yellow-600" : "text-red-600"
                  }>{t.status}</span>
                </td>
                <td className="px-2 py-2">{t.note ?? "-"}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={7} className="px-2 py-6 text-center text-gray-500">No transactions yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
