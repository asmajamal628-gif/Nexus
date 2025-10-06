// src/components/PaymentUI.tsx
import React, { useState } from "react";
import { useWallet } from "../src/context/WalletContext";

const PaymentUI: React.FC = () => {
  const { deposit, withdraw, transfer, fundDeal } = useWallet();
  const [walletId, setWalletId] = useState("wallet_user");
  const [toWalletId, setToWalletId] = useState("wallet_investor");
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");

  const handleDeposit = () => deposit(walletId, amount, note);
  const handleWithdraw = () => withdraw(walletId, amount, note);
  const handleTransfer = () => transfer(walletId, toWalletId, amount, note);
  const handleFund = () => fundDeal("wallet_investor", "wallet_entrepreneur", amount, note);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">💰 Mock Payment Actions</h2>
      <div className="flex flex-col gap-3">
        <input
          type="number"
          placeholder="Amount"
          className="border rounded px-3 py-2"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Note (optional)"
          className="border rounded px-3 py-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex flex-wrap gap-2 mt-3">
          <button onClick={handleDeposit} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Deposit
          </button>
          <button onClick={handleWithdraw} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Withdraw
          </button>
          <button onClick={handleTransfer} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Transfer
          </button>
          <button onClick={handleFund} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Fund Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentUI;
