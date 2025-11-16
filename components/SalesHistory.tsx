
import React from 'react';
import { SaleRecord } from '../types';

const SalesHistory: React.FC<{ sales: SaleRecord[] }> = ({ sales }) => {
  if (sales.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-lg font-medium text-gray-900">No sales recorded yet</h3>
        <p className="mt-1 text-sm text-gray-500">Sell a product from your stock to see sales history here.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Sold</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Details</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifier</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.slice().reverse().map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sale.dateSold).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sale.product.brand}</div>
                    <div className="text-sm text-gray-500">{sale.product.model}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.product.identifier || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{formatCurrency(sale.product.sellingPrice)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${sale.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(sale.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesHistory;