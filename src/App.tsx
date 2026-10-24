import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PosView } from './components/pos/PosView';
import { InventoryView } from './components/inventory/InventoryView';
import { StockKilosView } from './components/stock/StockKilosView';
import { SalesHistoryView } from './components/sales/SalesHistoryView';
import { DestinationsView } from './components/destinations/DestinationsView';
import { StaffView } from './components/staff/StaffView';
import { DashboardView } from './components/dashboard/DashboardView';
import { PurchasesView } from './components/purchases/PurchasesView';
import { ReportsView } from './components/reports/ReportsView';
import { CustomersView } from './components/customers/CustomersView';
import { CashModal } from './components/cash/CashModal';

const MainLayout: React.FC = () => {
  const { activeView } = useApp();
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'pos':
        return <PosView />;
      case 'inventory':
        return <InventoryView />;
      case 'stock':
        return <StockKilosView />;
      case 'sales':
        return <SalesHistoryView />;
      case 'destinations':
        return <DestinationsView />;
      case 'staff':
        return <StaffView />;
      case 'dashboard':
        return <DashboardView />;
      case 'purchases':
        return <PurchasesView />;
      case 'reports':
        return <ReportsView />;
      case 'customers':
        return <CustomersView />;
      default:
        return <PosView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation Header matching screenshot */}
      <Header />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onOpenCashModal={() => setIsCashModalOpen(true)} />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {renderActiveView()}
        </main>
      </div>

      {/* Cash Shift Modal */}
      <CashModal isOpen={isCashModalOpen} onClose={() => setIsCashModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
