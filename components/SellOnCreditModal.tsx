
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Customer } from '../types';
import AutocompleteInput from './AutocompleteInput';

interface SellOnCreditModalProps {
  product: Product;
  customers: Customer[];
  onConfirm: (customerId: string, condition: string) => void;
  onClose: () => void;
}

const SellOnCreditModal: React.FC<SellOnCreditModalProps> = ({ product, customers, onConfirm, onClose }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [error, setError] = useState('');

  const customerSuggestions = useMemo(() => {
    return customers.map(c => c.name);
  }, [customers]);

  const handleCustomerSelect = (customerName: string) => {
    const customer = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
    setCustomerSearch(customerName);
    if (customer) {
        setSelectedCustomer(customer);
    } else {
        setSelectedCustomer(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setError('Please select a valid customer from the list.');
      return;
    }
    onConfirm(selectedCustomer.id, condition);
  };
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-xl font-semibold text-gray-900">Sell on Credit</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-bold text-gray-800">{product.brand} {product.model}</p>
            <p className="text-sm text-gray-500">Sale Amount: <span className="font-bold text-green-600">₹{product.sellingPrice.toLocaleString()}</span></p>
          </div>
          
          <AutocompleteInput
            label="Select Customer"
            value={customerSearch}
            onChange={(e) => {
                setCustomerSearch(e.target.value);
                setSelectedCustomer(null);
                setError('');
            }}
            onSelect={handleCustomerSelect}
            placeholder="Search for a customer..."
            suggestions={customerSuggestions}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Condition / Note (Optional)</label>
            <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="e.g., Pay by end of month"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Confirm Credit Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellOnCreditModal;
