
import React, { useState, useMemo } from 'react';
import { Customer, KhataEntry, AppSettings } from '../types';
import { PlusIcon, UserGroupIcon, PencilIcon, TrashIcon, SearchIcon, CurrencyRupeeIcon, UserCircleIcon } from './icons';
import AddCustomerModal from './AddCustomerModal';
import CustomerKhataDetail from './CustomerKhataDetail';

interface KhataManagerProps {
  customers: Customer[];
  khataEntries: KhataEntry[];
  addCustomer: (customer: Omit<Customer, 'id' | 'photo'> & { photo?: string }) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  addKhataEntry: (entry: Omit<KhataEntry, 'id' | 'date'>) => void;
  settings: AppSettings;
}

const SummaryCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg flex items-center space-x-4">
        <div className="p-3 bg-indigo-100 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const KhataManager: React.FC<KhataManagerProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const customerBalances = useMemo(() => {
    const balances = new Map<string, number>();
    props.khataEntries.forEach(entry => {
      const currentBalance = balances.get(entry.customerId) || 0;
      if (entry.type === 'credit') {
        balances.set(entry.customerId, currentBalance + entry.amount);
      } else {
        balances.set(entry.customerId, currentBalance - entry.amount);
      }
    });
    return balances;
  }, [props.khataEntries]);

  const { customersWithDue, totalReceivable } = useMemo(() => {
    const dueCustomers = props.customers.filter(c => (customerBalances.get(c.id) || 0) > 0);
    const receivable = Array.from(customerBalances.values())
        .filter(balance => Number(balance) > 0)
        // FIX: Explicitly type accumulator and value in `reduce` to prevent `sum` being inferred as `unknown`.
        .reduce((sum: number, balance: number) => sum + balance, 0);

    return {
        customersWithDue: dueCustomers.length,
        totalReceivable: receivable,
    };
  }, [props.customers, customerBalances]);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) {
        return props.customers;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return props.customers.filter(customer =>
        customer.name.toLowerCase().includes(lowercasedFilter)
    );
  }, [props.customers, searchTerm]);

  const handleAddNewCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };
  
  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  if (selectedCustomer) {
    return (
        <CustomerKhataDetail
            customer={selectedCustomer}
            entries={props.khataEntries.filter(e => e.customerId === selectedCustomer.id)}
            balance={customerBalances.get(selectedCustomer.id) || 0}
            onBack={() => setSelectedCustomer(null)}
            addEntry={props.addKhataEntry}
            creditLabel={props.settings.creditLabel}
            debitLabel={props.settings.debitLabel}
        />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Customer Khata</h2>
        <button
          onClick={handleAddNewCustomer}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Customers" value={props.customers.length} icon={<UserGroupIcon className="h-6 w-6 text-indigo-600" />} />
        <SummaryCard title="Customers with Due" value={customersWithDue} icon={<UserGroupIcon className="h-6 w-6 text-red-500" />} />
        <SummaryCard title="Total Receivable" value={formatCurrency(totalReceivable)} icon={<CurrencyRupeeIcon className="h-6 w-6 text-green-600" />} />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search customer by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {props.customers.length === 0 ? (
        <div className="text-center py-10 px-6 bg-white rounded-xl shadow-lg">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Click 'Add New Customer' to create a new khata.
          </p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-10 px-6 bg-white rounded-xl shadow-lg">
          <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No customers match your search</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try a different name or clear the search field.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredCustomers.map(customer => {
              const balance = customerBalances.get(customer.id) || 0;
              return (
                <li key={customer.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border">
                            {customer.photo ? (
                            <img src={customer.photo} alt={customer.name} className="w-full h-full object-cover" />
                            ) : (
                            <UserCircleIcon className="w-full h-full text-gray-400" />
                            )}
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-indigo-700">{customer.name}</p>
                            <p className="text-sm text-gray-500">{customer.phone || 'No phone number'}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Balance</p>
                            <p className={`font-bold text-lg ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatCurrency(balance)}
                            </p>
                        </div>
                        <button onClick={() => handleEditCustomer(customer)} className="text-gray-400 hover:text-indigo-600"><PencilIcon className="h-5 w-5"/></button>
                        <button onClick={() => props.deleteCustomer(customer.id)} className="text-gray-400 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {isModalOpen && (
        <AddCustomerModal
          customer={editingCustomer}
          onSave={(customerData) => {
            if (editingCustomer) {
                props.updateCustomer({ ...editingCustomer, ...customerData });
            } else {
                props.addCustomer(customerData);
            }
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default KhataManager;