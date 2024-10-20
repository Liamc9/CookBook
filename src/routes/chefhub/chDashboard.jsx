import React from 'react';

const ChDashboard = () => {
  return (
    <div className="p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>

      {/* Metrics */}
      <div className="grid gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-sm font-medium text-gray-600">Total Sales</h2>
          <p className="text-2xl font-bold">$15,230</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-sm font-medium text-gray-600">New Users</h2>
          <p className="text-2xl font-bold">1,245</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-sm font-medium text-gray-600">Website Visits</h2>
          <p className="text-2xl font-bold">18,900</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-sm font-medium text-gray-600">Conversion Rate</h2>
          <p className="text-2xl font-bold">4.5%</p>
        </div>
      </div>
    </div>
  );
};

export default ChDashboard;

// Usage: import Dashboard from './Dashboard' and include <Dashboard /> in your main component.
