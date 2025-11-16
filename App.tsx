
import React, { useState, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Product, SaleRecord, Customer, KhataEntry, AppSettings } from './types';
import Header from './components/Header';
import StockManager from './components/StockManager';
import SalesDashboard from './components/SalesDashboard';
import KhataManager from './components/KhataManager';
import Settings from './components/Settings';
import LockScreen from './components/LockScreen';
import { useAuth } from './contexts/AuthContext';
import { PhoneIcon } from './components/icons';

type View = 'stock' | 'dashboard' | 'khata' | 'settings';

const App: React.FC = () => {
  const { isLocked } = useAuth();
  const [stock, setStock] = useLocalStorage<Product[]>('stock', []);
  const [sales, setSales] = useLocalStorage<SaleRecord[]>('sales', []);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);
  const [khataEntries, setKhataEntries] = useLocalStorage<KhataEntry[]>('khataEntries', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', {
    ownerName: 'Store Owner',
    ownerPhoto: '',
    ownerEmail: '',
    ownerPhone: '',
    creditLabel: 'Udhaar Diya (Credit)',
    debitLabel: 'Paisa Liya (Debit)',
  });
  const [currentView, setCurrentView] = useState<View>('stock');
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);


  const addStock = useCallback((product: Omit<Product, 'id' | 'dateAdded'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      dateAdded: new Date().toISOString(),
    };
    setStock(prevStock => [newProduct, ...prevStock]);
    setHighlightedProductId(newProduct.id);
    setTimeout(() => setHighlightedProductId(null), 3000);
  }, [setStock]);

  const updateStock = useCallback((updatedProduct: Product) => {
    setStock(prevStock => 
      prevStock.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  }, [setStock]);

  const deleteStock = useCallback((productId: string) => {
    setStock(prevStock => prevStock.filter(p => p.id !== productId));
  }, [setStock]);

  const addKhataEntry = useCallback((entry: Omit<KhataEntry, 'id' | 'date'>) => {
    const newEntry: KhataEntry = { ...entry, id: crypto.randomUUID(), date: new Date().toISOString() };
    setKhataEntries(prev => [newEntry, ...prev]);
  }, [setKhataEntries]);

  const sellProduct = useCallback((productId: string) => {
    const productToSell = stock.find(p => p.id === productId);
    if (productToSell) {
      const newSale: SaleRecord = {
        id: crypto.randomUUID(),
        product: { ...productToSell, quantity: 1 },
        dateSold: new Date().toISOString(),
        profit: productToSell.sellingPrice - productToSell.purchasePrice,
      };
      setSales(prevSales => [...prevSales, newSale]);

      if (productToSell.quantity > 1) {
        const updatedProduct = { ...productToSell, quantity: productToSell.quantity - 1 };
        updateStock(updatedProduct);
      } else {
        deleteStock(productId);
      }
    }
  }, [stock, setSales, updateStock, deleteStock]);
  
  const sellProductOnCredit = useCallback((productId: string, customerId: string, condition: string) => {
    const productToSell = stock.find(p => p.id === productId);
    if (productToSell && customers.find(c => c.id === customerId)) {
      // 1. Create sale record
      const newSale: SaleRecord = {
        id: crypto.randomUUID(),
        product: { ...productToSell, quantity: 1 },
        dateSold: new Date().toISOString(),
        profit: productToSell.sellingPrice - productToSell.purchasePrice,
      };
      setSales(prevSales => [...prevSales, newSale]);

      // 2. Add Khata Entry
      const khataDescription = `Sold: ${productToSell.brand} ${productToSell.model}`;
      addKhataEntry({
          customerId,
          type: 'credit',
          amount: productToSell.sellingPrice,
          description: khataDescription,
          productName: `${productToSell.brand} ${productToSell.model}`,
          condition: condition || undefined,
      });

      // 3. Update stock
      if (productToSell.quantity > 1) {
        const updatedProduct = { ...productToSell, quantity: productToSell.quantity - 1 };
        updateStock(updatedProduct);
      } else {
        deleteStock(productId);
      }
    }
  }, [stock, customers, setSales, addKhataEntry, updateStock, deleteStock]);

  const addCustomer = useCallback((customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = { ...customer, id: crypto.randomUUID() };
    setCustomers(prev => [newCustomer, ...prev]);
  }, [setCustomers]);

  const updateCustomer = useCallback((updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  }, [setCustomers]);

  const deleteCustomer = useCallback((customerId: string) => {
    if(window.confirm('Are you sure you want to delete this customer? All their transaction history will also be deleted.')) {
        setCustomers(prev => prev.filter(c => c.id !== customerId));
        setKhataEntries(prev => prev.filter(entry => entry.customerId !== customerId));
    }
  }, [setCustomers, setKhataEntries]);

  const backupData = useCallback(() => {
    const dataToBackup = {
      stock,
      sales,
      customers,
      khataEntries,
      settings,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToBackup, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `vishwakarma-store-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }, [stock, sales, customers, khataEntries, settings]);

  const resetApp = useCallback(() => {
    window.localStorage.removeItem('app-pin');
    window.localStorage.removeItem('stock');
    window.localStorage.removeItem('sales');
    window.localStorage.removeItem('customers');
    window.localStorage.removeItem('khataEntries');
    window.localStorage.removeItem('app-settings');
    window.location.reload();
  }, []);

  if (isLocked) {
    return <LockScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-12">
      <Header currentView={currentView} setCurrentView={setCurrentView} settings={settings} />
      <main className="p-4 sm:p-6 md:p-8">
        {currentView === 'stock' && (
          <StockManager 
            stock={stock} 
            addStock={addStock} 
            sellProduct={sellProduct}
            updateStock={updateStock}
            deleteStock={deleteStock}
            highlightedProductId={highlightedProductId}
            customers={customers}
            sellProductOnCredit={sellProductOnCredit}
          />
        )}
        {currentView === 'dashboard' && <SalesDashboard sales={sales} />}
        {currentView === 'khata' && (
            <KhataManager
                customers={customers}
                khataEntries={khataEntries}
                addCustomer={addCustomer}
                updateCustomer={updateCustomer}
                deleteCustomer={deleteCustomer}
                addKhataEntry={addKhataEntry}
                settings={settings}
            />
        )}
        {currentView === 'settings' && (
            <Settings 
                settings={settings}
                onSettingsChange={setSettings}
                onBackup={backupData}
                onReset={resetApp}
            />
        )}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center space-x-2">
            <PhoneIcon className="h-5 w-5 text-indigo-600"/>
            <span>Vishwakarma Store © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;