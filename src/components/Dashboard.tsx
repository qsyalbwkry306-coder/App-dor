
import React from 'react';
import { AppState } from '../types';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC<{ data: AppState }> = ({ data }) => {
  const totalRevenue = data.orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalPaid = data.orders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingAmount = totalRevenue - totalPaid;
  const netProfit = totalPaid - totalExpenses;

  const chartData = [
    { name: 'إيرادات', value: totalPaid, color: '#4f46e5' },
    { name: 'مصاريف', value: totalExpenses, color: '#ef4444' },
    { name: 'ديون', value: pendingAmount, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <TrendingUp size={16} />
            <span className="text-xs font-bold">إجمالي المحصل</span>
          </div>
          <div className="text-xl font-bold">{totalPaid.toLocaleString()} ريال</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <TrendingDown size={16} />
            <span className="text-xs font-bold">إجمالي المصاريف</span>
          </div>
          <div className="text-xl font-bold">{totalExpenses.toLocaleString()} ريال</div>
        </div>
      </div>

      <div className="bg-indigo-600 p-5 rounded-2xl shadow-md text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">صافي الربح الفعلي</p>
          <h2 className="text-3xl font-black">{netProfit.toLocaleString()} ريال</h2>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="bg-white/20 px-2 py-1 rounded">المبالغ المستلمة - المصاريف</span>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold mb-4 text-slate-500">نظرة عامة على السيولة</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Clock size={16} className="text-indigo-500" />
          طلبات قيد التصنيع
        </h3>
        <div className="space-y-3">
          {data.orders.filter(o => o.status === 'تحت التصنيع').map(order => (
            <div key={order.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-bold">{data.customers.find(c => c.id === order.customerId)?.name}</p>
                <p className="text-xs text-slate-500">{order.doorType} - {order.dimensions.width}×{order.dimensions.height}</p>
              </div>
              <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">
                جاري العمل
              </div>
            </div>
          ))}
          {data.orders.filter(o => o.status === 'تحت التصنيع').length === 0 && (
            <p className="text-center text-slate-400 text-sm py-4">لا توجد طلبات جارية حالياً</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
