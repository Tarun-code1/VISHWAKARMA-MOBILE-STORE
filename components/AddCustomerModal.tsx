
import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import ImageUpload from './ImageUpload';
import { UserCircleIcon } from './icons';

interface AddCustomerModalProps {
    customer: Customer | null;
    onSave: (customerData: Omit<Customer, 'id' | 'photo'> & { photo?: string }) => void;
    onClose: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ customer, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (customer) {
            setName(customer.name);
            setPhone(customer.phone || '');
            setPhoto(customer.photo || null);
        }
    }, [customer]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Customer name is required.');
            return;
        }
        onSave({ name, phone, photo: photo || undefined });
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{customer ? 'Edit Customer' : 'Add New Customer'}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    </div>

                    <ImageUpload
                        photo={photo}
                        onPhotoChange={setPhoto}
                        placeholderIcon={<UserCircleIcon className="h-16 w-16 text-gray-400" />}
                        captureMode="user"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter full name"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700">{customer ? 'Save Changes' : 'Add Customer'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCustomerModal;