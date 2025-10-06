import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Calendar } from './Calendar';
import WalletCard from "../wallet/WalletCard";




export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 overflow-hidden">
  
  <aside className="md:col-span-1 lg:col-span-1 bg-white border-r animate-slide-in">
    <Sidebar />
    
  </aside>
        
  <main className="md:col-span-3 lg:col-span-4 overflow-y-auto p-6 animate-fade-in">
    <div className="max-w-7xl mx-auto">
      
    <Outlet />

    <Calendar />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <WalletCard />
  {/* other widgets */}
</div>
   
            <button className="mt-4 bg-accent-500 text-white px-4 py-2 rounded animate-bounce-slow">
  🔔 Notifications
</button>

          </div>
        </main>
      </div>
    </div>
  );
};