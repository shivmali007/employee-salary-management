"use client";
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList
} from 'recharts';
import { Users, DollarSign, Globe, Building2, Search, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import EditEmployeeModal from '@/components/EditEmployeeModal';
import CustomTooltip from '@/components/CustomTooltip';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];

export default function HRDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [detailedBreakdown, setDetailedBreakdown] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [countryFilter, setCountryFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [search, page, countryFilter, deptFilter]);

  async function fetchAnalytics() {
    const res = await fetch('/api/analytics');
    const data = await res.json();
    setSummary(data.summary);
    setCountryData(data.countryDistribution);
    setDeptData(data.deptDistribution);
    setDetailedBreakdown(data.detailedBreakdown);
  }

  async function fetchEmployees() {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      search: search,
      country: countryFilter,
      department: deptFilter
    });
    const res = await fetch(`/api/employees?${params.toString()}`);
    const data = await res.json();
    setEmployees(data.employees);
    setPagination(data.pagination);
    setLoading(false);
  }

  if (!summary) return <div className="flex items-center justify-center h-screen">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ACME HR Portal</h1>
          <p className="text-gray-500">Salary Management System</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">System Status:</span>
          <span className="text-sm font-bold text-green-600">Live</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card icon={<DollarSign className="text-blue-600" />} label="Total Payroll" value={`$${summary.totalPayroll.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
        <Card icon={<Users className="text-green-600" />} label="Total Employees" value={summary.totalEmployees.toLocaleString()} />
        <Card icon={<Globe className="text-purple-600" />} label="Avg. Salary" value={`$${summary.avgSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-gray-900">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Salary by Country</h2>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[...countryData].sort((a, b) => b._sum.salary - a._sum.salary)}
                margin={{ left: 40, right: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="country"
                  type="category"
                  stroke="#6b7280"
                  width={100}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  itemStyle={{ color: '#111827' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Salary']}
                />
                <Bar dataKey="_sum.salary" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  <LabelList
                    dataKey="_sum.salary"
                    position="right"
                    formatter={(val: number) => `$${(val / 1000000).toFixed(1)}M`}
                    style={{ fontSize: '12px', fontWeight: '600', fill: '#374151', marginLeft: '8px' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-gray-900">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Departmental Split</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-8 h-full">
            {/* Left: Doughnut Chart */}
            <div className="flex-1 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData.map(dept => {
                      const breakdown = detailedBreakdown
                        .filter(item => item.department === dept.department)
                        .map(item => ({
                          ...item,
                          percentage: ((item._sum.salary / dept._sum.salary) * 100).toFixed(1)
                        }))
                        .sort((a, b) => b._sum.salary - a._sum.salary);

                      return { ...dept, breakdown };
                    })}
                    dataKey="_sum.salary"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {deptData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <LabelList
                      dataKey="_sum.salary"
                      position="outside"
                      formatter={(val: number) => `$${(val / 1000000).toFixed(1)}M`}
                      style={{ fontSize: '11px', fontWeight: '600', fill: '#4b5563' }}
                    />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Right: Interactive Legend */}
            <div className="w-full md:w-72 overflow-y-auto max-h-80 custom-scrollbar">
              <div className="space-y-2">
                {deptData.map((dept) => (
                  <div key={dept.department} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedDept(expandedDept === dept.department ? null : dept.department)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[deptData.indexOf(dept) % COLORS.length] }} />
                        <span className="text-sm font-medium truncate">{dept.department}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">${(dept._sum.salary / 1000000).toFixed(1)}M</span>
                        {expandedDept === dept.department ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>
                    {expandedDept === dept.department && (
                      <div className="bg-gray-50 p-3 border-t space-y-2">
                        {detailedBreakdown
                          .filter(item => item.department === dept.department)
                          .sort((a, b) => b._sum.salary - a._sum.salary)
                          .map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-gray-200 last:border-0">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-700">{item.country}</span>
                                <span className="text-[10px] text-gray-400">{item._count.id} emp</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">${item._sum.salary.toLocaleString()}</div>
                                <div className="text-[10px] text-blue-600">{((item._sum.salary / dept._sum.salary) * 100).toFixed(1)}%</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold">Employee Directory</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, dept..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Country:</span>
              <select
                className="text-sm border rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Countries</option>
                {countryData.map(c => <option key={c.country} value={c.country}>{c.country}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Department:</span>
              <select
                className="text-sm border rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Departments</option>
                {deptData.map(d => <option key={d.department} value={d.department}>{d.department}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Country</th>
                <th className="px-6 py-3 text-right">Salary</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-500">Loading employees...</td></tr>
              ) : (employees || []).map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600">{emp.name}</td>
                  <td className="px-6 py-4 text-gray-500">{emp.email}</td>
                  <td className="px-6 py-4 text-gray-500">{emp.phone}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{emp.department}</span></td>
                  <td className="px-6 py-4 text-gray-600">{emp.country}</td>
                  <td className="px-6 py-4 text-right font-mono font-semibold">${emp.salary.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditingEmployee(emp)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Salary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this employee?')) {
                            const res = await fetch(`/api/employees/${emp.id}`, { method: 'DELETE' });
                            if (res.ok) {
                              fetchEmployees();
                            } else {
                              alert('Failed to delete employee. Please try again.');
                            }
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center bg-gray-50">
          <span className="text-xs text-gray-500">
            Page {page} of {pagination?.totalPages || 1} ({pagination?.total || 0} employees)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 text-xs border rounded bg-white disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              disabled={page === pagination?.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 text-xs border rounded bg-white disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSave={async (updatedData) => {
            await fetch(`/api/employees/${editingEmployee.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData),
            });
            fetchEmployees();
          }}
        />
      )}
    </div>
  );
}

function Card({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
      <div className="p-3 bg-gray-50 rounded-lg shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
        <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate" title={value}>
          {value}
        </p>
      </div>
    </div>
  );
}
