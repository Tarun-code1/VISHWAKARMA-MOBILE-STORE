
import React, { useState } from 'react';
import { Customer, KhataEntry } from '../types';
import { ArrowLeftIcon, UserCircleIcon } from './icons';

interface CustomerKhataDetailProps {
    customer: Customer;
    entries: KhataEntry[];
    balance: number;
    onBack: () => void;
    addEntry: (entry: Omit<KhataEntry, 'id' | 'date'>) => void;
    creditLabel: string;
    debitLabel: string;
}

const CustomerKhataDetail: React.FC<CustomerKhataDetailProps> = ({ customer, entries, balance, onBack, addEntry, creditLabel, debitLabel }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [condition, setCondition] = useState('');
    const [type, setType] = useState<'credit' | 'debit'>('credit');
    const [error, setError] = useState('');

    const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid positive amount.');
            return;
        }
        if (!description) {
            setError('Please enter a description.');
            return;
        }
        addEntry({
            customerId: customer.id,
            type,
            amount: numAmount,
            description,
            condition: condition || undefined,
        });
        setAmount('');
        setDescription('');
        setCondition('');
        setError('');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border">
                    {customer.photo ? (
                        <img src={customer.photo} alt={customer.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserCircleIcon className="w-full h-full text-gray-400" />
                    )}
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{customer.name}</h2>
                    <p className="text-gray-500">{customer.phone}</p>
                </div>
                <div className="flex-grow text-right">
                    <p className="text-sm text-gray-500">Current Balance</p>
                    <p className={`text-3xl font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(balance)}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">Add New Transaction</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Payment received" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700">Condition / Note (Optional)</label>
                            <input type="text" value={condition} onChange={e => setCondition(e.target.value)} placeholder="e.g., Pay by end of month" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="type" value="credit" checked={type === 'credit'} onChange={() => setType('credit')} className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"/>
                                <span className="text-red-600 font-medium">{creditLabel}</span>
                            </label>
                             <label className="flex items-center space-x-2">
                                <input type="radio" name="type" value="debit" checked={type === 'debit'} onChange={() => setType('debit')} className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"/>
                                <span className="text-green-600 font-medium">{debitLabel}</span>
                            </label>
                        </div>
                         <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700">Add Entry</button>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <h3 className="text-xl font-semibold text-gray-900 p-4 border-b">Transaction History</h3>
                {sortedEntries.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">No transactions recorded yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {sortedEntries.map(entry => (
                             <li key={entry.id} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-800">{entry.description}</p>
                                        {entry.productName && <p className="text-sm text-indigo-600 font-medium">Product: {entry.productName}</p>}
                                        {entry.condition && <p className="text-sm text-gray-500 italic">Note: {entry.condition}</p>}
                                        <p className="text-xs text-gray-500 mt-1">{new Date(entry.date).toLocaleString()}</p>
                                    </div>
                                    <p className={`text-lg font-bold ${entry.type === 'credit' ? 'text-red-500' : 'text-green-500'}`}>
                                        {entry.type === 'credit' ? '-' : '+'} {formatCurrency(entry.amount)}
                                    </p>
                                </div>
                             </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default CustomerKhataDetail;