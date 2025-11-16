
import React from 'react';
import { SaleRecord } from '../types';
import ProfitSummary from './ProfitSummary';
import SalesHistory from './SalesHistory';

interface SalesDashboardProps {
  sales: SaleRecord[];
}

const SalesDashboard: React.FC<SalesDashboardProps> = ({ sales }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Sales Dashboard</h2>
        <ProfitSummary sales={sales} />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Sales History</h2>
        <SalesHistory sales={sales} />
      </div>
    </div>
  );
};

export default SalesDashboard;
