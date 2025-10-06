// src/components/wallet/WalletCard.tsx
import React from "react";
import { useWallet } from "../../context/WalletContext";

const WalletCard: React.FC<{ walletId?: string }> = ({ walletId = "wallet_user" }) => {
  const { wallets } = useWallet();
  const wallet = wallets.find((w) => w.id === walletId) || wallets[0];

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 rounded-xl shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm">Wallet Balance</div>
          <div className="text-2xl font-bold mt-1">${wallet.balance.toFixed(2)}</div>
        </div>
        <div className="text-right text-xs opacity-80">
          <div>{wallet.owner}</div>
          <div className="mt-1">{wallet.id}</div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
