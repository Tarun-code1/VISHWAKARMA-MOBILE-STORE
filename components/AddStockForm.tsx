
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import AutocompleteInput from './AutocompleteInput';
import ImageUpload from './ImageUpload';
import { TagIcon } from './icons';

interface AddStockFormProps {
  addStock: (product: Omit<Product, 'id' | 'dateAdded'>) => void;
  stock: Product[];
}

// Moved outside the main component to prevent re-creation on every render, which fixes the input focus bug.
const SimpleInputField: React.FC<{ label: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string }> = ({ label, type, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            step={type === 'number' ? 'any' : undefined} // Allow decimals in price
            min={type === 'number' ? '0' : undefined}
        />
    </div>
);

const AddStockForm: React.FC<AddStockFormProps> = ({ addStock, stock }) => {
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Suggestions for autocompletion
  const allCategories = useMemo(() => {
    const staticCategories = ["Mobile", "Laptop", "Accessory", "Charger", "Headphones", "Screen Guard"];
    if (!stock) return staticCategories;
    const dynamicCategories = stock.map(p => p.category);
    return [...new Set([...staticCategories, ...dynamicCategories])];
  }, [stock]);

  const suggestedBrands = useMemo(() => {
    if (!stock) return [];
    let relevantStock = stock;
    if (category) {
      relevantStock = stock.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    const brands = relevantStock.map(p => p.brand);
    return [...new Set(brands)];
  }, [stock, category]);

  const suggestedModels = useMemo(() => {
    if (!stock || !brand) return []; // Only suggest models if a brand is selected
    const relevantStock = stock.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    const models = relevantStock.map(p => p.model);
    return [...new Set(models)];
  }, [stock, brand]);

  const suggestedIdentifiers = useMemo(() => {
      if (!stock) return [];
      const identifiers = stock.map(p => p.identifier).filter(Boolean);
      return [...new Set(identifiers)] as string[];
  }, [stock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !brand || !model || !purchasePrice || !sellingPrice || !quantity) {
      setError('Category, Brand, Model, Quantity, and prices are required.');
      return;
    }
    const pp = parseFloat(purchasePrice);
    const sp = parseFloat(sellingPrice);
    const qty = parseInt(quantity, 10);

    if (isNaN(pp) || isNaN(sp) || pp < 0 || sp < 0 || isNaN(qty) || qty <= 0) {
      setError('Prices and quantity must be valid positive numbers.');
      return;
    }
    
    addStock({
        category,
        brand,
        model,
        purchasePrice: pp,
        sellingPrice: sp,
        identifier: identifier || undefined,
        quantity: qty,
        photo: photo || undefined,
    });
    
    // Reset form
    setCategory('');
    setBrand('');
    setModel('');
    setIdentifier('');
    setPurchasePrice('');
    setSellingPrice('');
    setQuantity('1');
    setPhoto(null);
    setError('');
  };

  const handleCategorySelect = (value: string) => {
    setCategory(value);
    setBrand('');
    setModel('');
  };

  const handleBrandSelect = (value: string) => {
    setBrand(value);
    setModel('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Add New Product Details</h3>
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Product Photo</label>
          <ImageUpload
            photo={photo}
            onPhotoChange={setPhoto}
            placeholderIcon={<TagIcon className="h-16 w-16 text-gray-400" />}
            captureMode="environment"
          />
        </div>
        <div className="md:w-2/3 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AutocompleteInput
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onSelect={handleCategorySelect}
              placeholder="e.g., Mobile, Accessory"
              suggestions={allCategories}
            />
            <AutocompleteInput
              label="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              onSelect={handleBrandSelect}
              placeholder="e.g., Apple"
              suggestions={suggestedBrands}
            />
            <AutocompleteInput
              label="Model / Name"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              onSelect={(value) => setModel(value)}
              placeholder="e.g., iPhone 14 Pro"
              suggestions={suggestedModels}
            />
            <AutocompleteInput
                label="Identifier (IMEI, S/N, SKU)"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onSelect={(value) => setIdentifier(value)}
                placeholder="Optional unique code"
                suggestions={suggestedIdentifiers}
            />
            <SimpleInputField label="Purchase Price (₹)" type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="e.g., 80000" />
            <SimpleInputField label="Selling Price (₹)" type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="e.g., 95000" />
            <SimpleInputField label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g., 1" />
          </div>
        </div>
      </div>


      {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
      <div className="flex justify-end pt-2 border-t">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Add to Stock
        </button>
      </div>
    </form>
  );
};

export default AddStockForm;