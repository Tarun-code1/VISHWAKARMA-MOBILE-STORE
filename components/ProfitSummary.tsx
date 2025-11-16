
import React, { useMemo } from 'react';
import { SaleRecord } from '../types';

interface ProfitSummaryProps {
  sales: SaleRecord[];
}

const SummaryCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

const ProfitSummary: React.FC<ProfitSummaryProps> = ({ sales }) => {
  const { totalRevenue, totalCost, totalProfit } = useMemo(() => {
    return sales.reduce(
      (acc, sale) => {
        acc.totalRevenue += sale.product.sellingPrice;
        acc.totalCost += sale.product.purchasePrice;
        acc.totalProfit += sale.profit;
        return acc;
      },
      { totalRevenue: 0, totalCost: 0, totalProfit: 0 }
    );
  }, [sales]);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Revenue" value={formatCurrency(totalRevenue)} color="text-green-600" />
        <SummaryCard title="Total Cost" value={formatCurrency(totalCost)} color="text-red-600" />
        <SummaryCard title="Total Profit" value={formatCurrency(totalProfit)} color="text-indigo-600" />
    </div>
  );
};

export default ProfitSummary;