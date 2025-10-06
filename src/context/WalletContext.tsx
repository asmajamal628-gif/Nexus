// src/context/WalletContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type TxType = "deposit" | "withdraw" | "transfer" | "fund";
export type TxStatus = "completed" | "failed" | "pending";

export type Transaction = {
  id: string;
  date: string; // ISO
  type: TxType;
  amount: number;
  sender: string | null;
  receiver: string | null;
  status: TxStatus;
  note?: string;
};

export type Wallet = {
  id: string;
  owner: string;
  balance: number;
};

type WalletContextType = {
  wallets: Wallet[];
  transactions: Transaction[];
  deposit: (walletId: string, amount: number, note?: string) => Promise<Transaction>;
  withdraw: (walletId: string, amount: number, note?: string) => Promise<Transaction>;
  transfer: (fromId: string, toId: string, amount: number, note?: string) => Promise<Transaction>;
  fundDeal: (investorId: string, entrepreneurId: string, amount: number, note?: string) => Promise<Transaction>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEY_WALLETS = "nexus_wallets_v1";
const STORAGE_KEY_TX = "nexus_tx_v1";

const seedWallets: Wallet[] = [
  { id: "wallet_user", owner: "You", balance: 2500 },
  { id: "wallet_investor", owner: "Investor", balance: 10000 },
  { id: "wallet_entrepreneur", owner: "Entrepreneur", balance: 500 },
];

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<Wallet[]>(
    () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_WALLETS);
        return raw ? (JSON.parse(raw) as Wallet[]) : seedWallets;
      } catch {
        return seedWallets;
      }
    }
  );

  const [transactions, setTransactions] = useState<Transaction[]>(
    () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_TX);
        return raw ? (JSON.parse(raw) as Transaction[]) : [];
      } catch {
        return [];
      }
    }
  );

  // persist wallets & transactions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WALLETS, JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
  }, [transactions]);

  // helper to push a tx to top of list
  const pushTx = useCallback((tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  }, []);

  // deposit
  const deposit = async (walletId: string, amount: number, note?: string): Promise<Transaction> => {
    const tx: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: "deposit",
      amount,
      sender: null,
      receiver: walletId,
      status: "completed",
      note,
    };

    setWallets(prev => prev.map(w => (w.id === walletId ? { ...w, balance: w.balance + amount } : w)));
    pushTx(tx);
    return tx;
  };

  // withdraw
  const withdraw = async (walletId: string, amount: number, note?: string): Promise<Transaction> => {
    const wallet = wallets.find(w => w.id === walletId);

    const txBase: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: "withdraw",
      amount,
      sender: walletId,
      receiver: null,
      status: "failed",
      note,
    };

    if (!wallet) {
      const tx = { ...txBase, note: "wallet not found" } as Transaction;
      pushTx(tx);
      return tx;
    }

    if (wallet.balance < amount) {
      const tx = { ...txBase, status: "failed" } as Transaction;
      pushTx(tx);
      return tx;
    }

    setWallets(prev => prev.map(w => (w.id === walletId ? { ...w, balance: w.balance - amount } : w)));
    const tx: Transaction = { ...txBase, status: "completed" };
    pushTx(tx);
    return tx;
  };

  // transfer
  const transfer = async (fromId: string, toId: string, amount: number, note?: string): Promise<Transaction> => {
    const from = wallets.find(w => w.id === fromId);
    const to = wallets.find(w => w.id === toId);

    const txBase: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: "transfer",
      amount,
      sender: fromId,
      receiver: toId,
      status: "failed",
      note,
    };

    if (!from || !to) {
      const tx = { ...txBase, note: "invalid wallets" } as Transaction;
      pushTx(tx);
      return tx;
    }

    if (from.balance < amount) {
      const tx = { ...txBase, status: "failed" } as Transaction;
      pushTx(tx);
      return tx;
    }

    setWallets(prev =>
      prev.map(w => {
        if (w.id === fromId) return { ...w, balance: w.balance - amount };
        if (w.id === toId) return { ...w, balance: w.balance + amount };
        return w;
      })
    );

    const tx: Transaction = { ...txBase, status: "completed" };
    pushTx(tx);
    return tx;
  };

  // fundDeal - perform transfer-like update but record type "fund"
  const fundDeal = async (investorId: string, entrepreneurId: string, amount: number, note?: string): Promise<Transaction> => {
    const investor = wallets.find(w => w.id === investorId);
    const entrepreneur = wallets.find(w => w.id === entrepreneurId);

    const txBase: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: "fund",
      amount,
      sender: investorId,
      receiver: entrepreneurId,
      status: "failed",
      note,
    };

    if (!investor || !entrepreneur) {
      const tx = { ...txBase, note: "invalid wallets" } as Transaction;
      pushTx(tx);
      return tx;
    }

    if (investor.balance < amount) {
      const tx = { ...txBase, status: "failed" } as Transaction;
      pushTx(tx);
      return tx;
    }

    // perform balances update
    setWallets(prev =>
      prev.map(w => {
        if (w.id === investorId) return { ...w, balance: w.balance - amount };
        if (w.id === entrepreneurId) return { ...w, balance: w.balance + amount };
        return w;
      })
    );

    const tx: Transaction = { ...txBase, status: "completed" };
    pushTx(tx);
    return tx;
  };

  return (
    <WalletContext.Provider value={{ wallets, transactions, deposit, withdraw, transfer, fundDeal }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
};
