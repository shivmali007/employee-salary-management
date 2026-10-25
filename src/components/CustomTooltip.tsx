"use client";
import React from 'react';

export default function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const department = data.department;
    const totalSalary = data._sum.salary;
    const totalEmployees = data._count.id;

    // Note: detailedBreakdown is passed via the custom payload in the Pie chart
    const breakdown = data.breakdown || [];

    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 max-w-xs overflow-hidden">
        <div className="mb-3 border-b pb-2">
          <h4 className="text-sm font-bold text-gray-900">{department} Department</h4>
          <div className="flex justify-between items-center gap-4 mt-1">
            <span className="text-xs text-gray-500">Total Salary:</span>
            <span className="text-xs font-semibold text-blue-600">${totalSalary.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-xs text-gray-500">Employees:</span>
            <span className="text-xs font-semibold text-gray-700">{totalEmployees}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Country-wise Breakdown</p>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
            {breakdown.length > 0 ? (
              breakdown.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-xs border-b border-gray-50 pb-1 last:border-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{item.country}</span>
                    <span className="text-[10px] text-gray-400">{item._count.id} employees</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${item._sum.salary.toLocaleString()}</div>
                    <div className="text-[10px] text-blue-500">{item.percentage}%</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No country data available</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
