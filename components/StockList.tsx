
import React, { useState } from 'react';
import { Product, Customer } from '../types';
import { PhoneIcon, LaptopIcon, AccessoryIcon, TagIcon, TrashIcon, PencilIcon, CreditCardIcon } from './icons';
import EditStockModal from './EditStockModal';
import SellOnCreditModal from './SellOnCreditModal';

interface StockListProps {
  stock: Product[];
  sellProduct: (productId: string) => void;
  updateStock: (product: Product) => void;
  deleteStock: (productId: string) => void;
  highlightedProductId: string | null;
  customers: Customer[];
  sellProductOnCredit: (productId: string, customerId: string, condition: string) => void;
}

const getProductIcon = (category: string, className: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('mobile') || cat.includes('phone')) {
        return <PhoneIcon className={className} />;
    }
    if (cat.includes('laptop') || cat.includes('macbook') || cat.includes('notebook')) {
        return <LaptopIcon className={className} />;
    }
    if (cat.includes('accessory') || cat.includes('charger') || cat.includes('cable') || cat.includes('headphones')) {
        return <AccessoryIcon className={className} />;
    }
    return <TagIcon className={className} />;
};


const StockList: React.FC<StockListProps> = ({ stock, sellProduct, updateStock, deleteStock, highlightedProductId, customers, sellProductOnCredit }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [creditSaleProduct, setCreditSaleProduct] = useState<Product | null>(null);

  const sortedStock = stock;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete ${productName}? This action cannot be undone.`)) {
      deleteStock(productId);
    }
  };
  
  const handleCloseModal = () => {
    setEditingProduct(null);
  };

  if (sortedStock.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white rounded-xl shadow-lg">
        <PhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No products in stock</h3>
        <p className="mt-1 text-sm text-gray-500">
          Click on 'Add New Product' to add items to your inventory.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedStock.map((product) => (
          <div 
            key={product.id} 
            className={`
              bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col
              ${highlightedProductId === product.id ? 'ring-4 ring-offset-2 ring-indigo-500' : ''}
            `}
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center">
                {product.photo ? (
                <img src={product.photo} alt={`${product.brand} ${product.model}`} className="w-full h-full object-cover" />
                ) : (
                <div className="p-4 bg-gray-200 rounded-full">
                    {getProductIcon(product.category, "h-12 w-12 text-gray-500")}
                </div>
                )}
            </div>
            <div className="p-5 relative flex-grow">
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full capitalize">
                      {product.category}
                  </span>
                  <span className="text-xs bg-indigo-200 text-indigo-800 font-bold px-2 py-1 rounded-full">
                      QTY: {product.quantity}
                  </span>
              </div>
              <div className="mb-4">
                  <p className="text-lg font-bold text-gray-800">{product.brand}</p>
                  <p className="text-sm text-gray-500">{product.model}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                  {product.identifier && <p className="text-gray-600 truncate"><span className="font-semibold">Identifier:</span> {product.identifier}</p>}
                  <p className="text-gray-600"><span className="font-semibold">Added:</span> {new Date(product.dateAdded).toLocaleDateString()}</p>
                  <div className="flex justify-between items-center pt-2">
                      <p className="text-green-600 font-bold">₹{product.sellingPrice.toLocaleString()}</p>
                      <p className="text-xs text-red-500">Cost: ₹{product.purchasePrice.toLocaleString()}</p>
                  </div>
              </div>
            </div>
            <div className="border-t flex">
                <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center space-x-2 text-sm text-gray-600 font-medium py-2 hover:bg-gray-100 transition-colors"
                >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                </button>
                <button
                    onClick={() => handleDelete(product.id, `${product.brand} ${product.model}`)}
                    className="flex-1 flex items-center justify-center space-x-2 text-sm text-red-500 font-medium py-2 border-l hover:bg-red-50 transition-colors"
                >
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete</span>
                </button>
            </div>
            <div className="grid grid-cols-2 divide-x bg-gray-50">
                <button
                    onClick={() => sellProduct(product.id)}
                    className="w-full text-green-600 font-bold py-3 text-sm hover:bg-green-100 transition-colors"
                >
                    Cash Sale
                </button>
                <button
                    onClick={() => setCreditSaleProduct(product)}
                    className="w-full text-blue-600 font-bold py-3 text-sm hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
                >
                    <CreditCardIcon className="h-4 w-4" />
                    <span>Credit Sale</span>
                </button>
            </div>
          </div>
        ))}
      </div>
      {editingProduct && (
        <EditStockModal
          product={editingProduct}
          onSave={updateStock}
          onClose={handleCloseModal}
          stock={stock}
        />
      )}
      {creditSaleProduct && (
        <SellOnCreditModal
            product={creditSaleProduct}
            customers={customers}
            onClose={() => setCreditSaleProduct(null)}
            onConfirm={(customerId, condition) => {
                sellProductOnCredit(creditSaleProduct.id, customerId, condition);
                setCreditSaleProduct(null);
            }}
        />
      )}
    </>
  );
};

export default StockList;