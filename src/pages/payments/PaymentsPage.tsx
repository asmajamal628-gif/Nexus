// src/pages/payments/PaymentsPage.tsx
import React from "react";
import WalletCard from "../../components/wallet/WalletCard";
import TransactionForm from "../../components/wallet/TransactionForm";
import TransactionTable from "../../components/wallet/TransactionTable";

const PaymentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <WalletCard />
        </div>

        <div className="md:col-span-2">
          <TransactionForm />
        </div>
      </div>

      <TransactionTable />

      {/* Mock payment UI section (simple card style) */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">Mock Checkout (Stripe-like)</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input placeholder="Card number" className="border px-3 py-2 rounded" />
          <input placeholder="Name on card" className="border px-3 py-2 rounded" />
          <input placeholder="Expiry (MM/YY)" className="border px-3 py-2 rounded" />
          <input placeholder="CVC" className="border px-3 py-2 rounded" />
        </div>
        <div className="mt-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Pay (simulate)</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
