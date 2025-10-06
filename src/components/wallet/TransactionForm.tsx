// src/components/wallet/TransactionForm.tsx
import React, { useState } from "react";
import { useWallet } from "../../context/WalletContext";

const TransactionForm: React.FC = () => {
  const { wallets, deposit, withdraw, transfer, fundDeal } = useWallet();
  const [mode, setMode] = useState<"deposit" | "withdraw" | "transfer" | "fund">("deposit");
  const [amount, setAmount] = useState<string>("");
  const [fromId, setFromId] = useState<string>(wallets[0]?.id || "");
  const [toId, setToId] = useState<string>(wallets[1]?.id || "");
  const [note, setNote] = useState("");

  const reset = () => {
    setAmount("");
    setNote("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return alert("Enter a valid amount");

    try {
      if (mode === "deposit") {
        await deposit(toId || wallets[0].id, amt, note);
        alert("Deposit simulated");
      } else if (mode === "withdraw") {
        await withdraw(fromId, amt, note);
        alert("Withdraw simulated");
      } else if (mode === "transfer") {
        await transfer(fromId, toId, amt, note);
        alert("Transfer simulated");
      } else if (mode === "fund") {
        await fundDeal(fromId, toId, amt, note);
        alert("Funding simulated");
      }
      reset();
    } catch (err) {
      console.error(err);
      alert("Action failed (check console)");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-3">
        <button className={`px-3 py-1 rounded ${mode==='deposit' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`} onClick={() => setMode("deposit")}>Deposit</button>
        <button className={`px-3 py-1 rounded ${mode==='withdraw' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`} onClick={() => setMode("withdraw")}>Withdraw</button>
        <button className={`px-3 py-1 rounded ${mode==='transfer' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`} onClick={() => setMode("transfer")}>Transfer</button>
        <button className={`px-3 py-1 rounded ${mode==='fund' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`} onClick={() => setMode("fund")}>Fund Deal</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(mode === "withdraw" || mode === "transfer" || mode === "fund") && (
            <select value={fromId} onChange={(e)=>setFromId(e.target.value)} className="border px-2 py-2 rounded">
              {wallets.map(w => <option key={w.id} value={w.id}>{w.owner} — {w.id}</option>)}
            </select>
          )}

          {(mode === "deposit" || mode === "transfer" || mode === "fund") && (
            <select value={toId} onChange={(e)=>setToId(e.target.value)} className="border px-2 py-2 rounded">
              {wallets.map(w => <option key={w.id} value={w.id}>{w.owner} — {w.id}</option>)}
            </select>
          )}
        </div>

        <input type="number" step="0.01" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" className="w-full border px-3 py-2 rounded" />

        <input type="text" value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Note (optional)" className="w-full border px-3 py-2 rounded" />

        <div className="flex items-center gap-3">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Confirm</button>
          <button type="button" onClick={reset} className="px-3 py-2 rounded border">Clear</button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
