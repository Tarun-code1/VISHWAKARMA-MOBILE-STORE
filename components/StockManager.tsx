import React, { useState, useMemo } from 'react';
import { Product, Customer } from '../types';
import AddStockForm from './AddStockForm';
import StockList from './StockList';
import { PlusIcon, SearchIcon } from './icons';

interface StockManagerProps {
  stock: Product[];
  addStock: (product: Omit<Product, 'id' | 'dateAdded'>) => void;
  sellProduct: (productId: string) => void;
  updateStock: (product: Product) => void;
  deleteStock: (productId: string) => void;
  highlightedProductId: string | null;
  customers: Customer[];
  sellProductOnCredit: (productId: string, customerId: string, condition: string) => void;
}

const StockManager: React.FC<StockManagerProps> = ({ stock, addStock, sellProduct, updateStock, deleteStock, highlightedProductId, customers, sellProductOnCredit }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStock = useMemo(() => {
    if (!searchTerm.trim()) {
      return stock;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return stock.filter(product =>
      product.category.toLowerCase().includes(lowercasedFilter) ||
      product.brand.toLowerCase().includes(lowercasedFilter) ||
      product.model.toLowerCase().includes(lowercasedFilter)
    );
  }, [stock, searchTerm]);

  const sortedStock = useMemo(() => {
    return [...filteredStock].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  }, [filteredStock]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Stock Inventory</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          <PlusIcon className="h-5 w-5" />
          <span>{isAdding ? 'Close Form' : 'Add New Product'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in-down">
          <AddStockForm
            stock={stock}
            addStock={(product) => {
              addStock(product);
              setIsAdding(false);
            }}
          />
        </div>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by category, brand, or model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <StockList 
        stock={sortedStock} 
        sellProduct={sellProduct} 
        updateStock={updateStock}
        deleteStock={deleteStock}
        highlightedProductId={highlightedProductId}
        customers={customers}
        sellProductOnCredit={sellProductOnCredit}
      />
    </div>
  );
};

export default StockManager;