// src/components/WalletBalance.tsx
import React from "react";
import { useWallet } from "../src/context/WalletContext";

const WalletBalance: React.FC = () => {
  const { wallets } = useWallet();

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-3">💳 Wallet Balances</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="border rounded-md p-3 bg-gray-50">
            <h3 className="font-medium">{wallet.owner}</h3>
            <p className="text-lg font-bold text-green-600">
              ${wallet.balance.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletBalance;
