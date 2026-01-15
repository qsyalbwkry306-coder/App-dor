
import React from 'react';
import { AppState } from '../types';
import { AlertCircle, Plus, Minus, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  data: AppState;
  updateData: (newData: Partial<AppState>) => void;
}

const Inventory: React.FC<Props> = ({ data, updateData }) => {
  const updateQuantity = (id: string, delta: number) => {
    const updated = data.inventory.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    );
    updateData({ inventory: updated });
  };

  const chartData = data.inventory.map(item => ({
    name: item.name, 'الكمية الحالية': item.quantity, 'الحد الأدنى': item.minLimit,
  }));

  const lowStockItems = data.inventory.filter(item => item.quantity <= item.minLimit);

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-2xl flex items-center gap-3 border transition-colors ${lowStockItems.length > 0 ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'}`}>
        <div className={`p-2 rounded-xl ${lowStockItems.length > 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}><AlertCircle size={20} /></div>
        <div>
          <h4 className={`text-xs font-bold ${lowStockItems.length > 0 ? 'text-amber-800' : 'text-green-800'}`}>{lowStockItems.length > 0 ? 'تنبيهات المخزون' : 'حالة المخزون جيدة'}</h4>
          <p className={`text-[10px] ${lowStockItems.length > 0 ? 'text-amber-600' : 'text-green-600'}`}>{lowStockItems.length > 0 ? `يوجد ${lowStockItems.length} مواد شارفت على الانتهاء` : 'جميع المواد فوق الحد الأدنى'}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6"><BarChart3 size={18} className="text-indigo-600" /><h3 className="text-sm font-bold text-slate-700">مقارنة الكميات بالحد الأدنى</h3></div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }}/>
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px' }} />
              <Bar dataKey="الكمية الحالية" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="الحد الأدنى" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-500 px-1">قائمة المواد الحالية</h3>
        {data.inventory.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-indigo-100 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-slate-800">{item.name}</h4>
                <p className="text-[11px] text-slate-400">الحد الأدنى المطلوب: <span className="font-bold">{item.minLimit} {item.unit}</span></p>
              </div>
              <div className={`text-[10px] font-bold px-3 py-1 rounded-full border ${item.quantity <= item.minLimit ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>{item.quantity <= item.minLimit ? 'نقص حاد' : 'متوفر'}</div>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-indigo-50/30 group-hover:border-indigo-50 transition-colors">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">الكمية الحالية</span>
                <div className="text-xl font-black text-slate-700">{item.quantity} <span className="text-xs font-medium text-slate-400">{item.unit}</span></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 active:scale-90 transition-transform shadow-sm hover:text-red-500"><Minus size={18} /></button>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-indigo-100"><Plus size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm flex items-center justify-center gap-2 mt-4 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"><Plus size={18} /> إضافة مادة جديدة للمخزن</button>
    </div>
  );
};
export default Inventory;
