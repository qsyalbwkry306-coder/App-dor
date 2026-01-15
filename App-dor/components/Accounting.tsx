
import React, { useState } from 'react';
import { AppState, Expense } from '../types.ts';
import { Plus, Trash2, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface Props {
  data: AppState;
  updateData: (newData: Partial<AppState>) => void;
}

const Accounting: React.FC<Props> = ({ data, updateData }) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: 'مواد خام', amount: 0, description: '', date: new Date().toISOString()
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = { ...(newExpense as Expense), id: Date.now().toString(), date: new Date().toISOString() };
    updateData({ expenses: [expense, ...data.expenses] });
    setShowExpenseForm(false);
  };

  const removeExpense = (id: string) => {
    updateData({ expenses: data.expenses.filter(e => e.id !== id) });
  };

  const totalRevenue = data.orders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4"><Wallet size={32} /></div>
        <h2 className="text-sm font-medium text-slate-500 mb-1">الرصيد الفعلي الحالي</h2>
        <div className="text-3xl font-black text-slate-800">{(totalRevenue - totalExpenses).toLocaleString()} ر.س</div>
        <div className="grid grid-cols-2 w-full gap-4 mt-6 pt-6 border-t border-slate-50">
          <div className="text-center">
            <div className="text-green-500 flex items-center justify-center gap-1 text-xs font-bold mb-1"><ArrowUpCircle size={14} /> الإيرادات</div>
            <div className="text-lg font-bold">{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="text-center border-r border-slate-50">
            <div className="text-red-500 flex items-center justify-center gap-1 text-xs font-bold mb-1"><ArrowDownCircle size={14} /> المصاريف</div>
            <div className="text-lg font-bold">{totalExpenses.toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-slate-800">سجل المصروفات</h3>
        <button onClick={() => setShowExpenseForm(true)} className="text-indigo-600 flex items-center gap-1 text-sm font-bold bg-indigo-50 px-3 py-1 rounded-full"><Plus size={16} /> إضافة صرف</button>
      </div>
      <div className="space-y-3">
        {data.expenses.map(exp => (
          <div key={exp.id} className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400 mb-0.5">{exp.category}</div>
              <p className="text-sm font-bold text-slate-700">{exp.description}</p>
              <p className="text-[10px] text-slate-400 mt-1">{new Date(exp.date).toLocaleDateString('ar-SA')}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-red-600 font-bold">-{exp.amount}</div>
              <button onClick={() => removeExpense(exp.id)} className="text-slate-300 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      {showExpenseForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">تسجيل مصاريف</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">الفئة</label>
                <select className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value as any})}>
                  <option value="مواد خام">مواد خام</option><option value="رواتب">رواتب</option><option value="إيجار">إيجار</option><option value="صيانة">صيانة</option><option value="أخرى">أخرى</option>
                </select>
              </div>
              <div><label className="text-xs text-slate-400 block mb-1">المبلغ</label><input required type="number" className="w-full p-3 bg-slate-50 rounded-xl" placeholder="0" onChange={e => setNewExpense({...newExpense, amount: +e.target.value})} /></div>
              <div><label className="text-xs text-slate-400 block mb-1">الوصف</label><input required type="text" className="w-full p-3 bg-slate-50 rounded-xl" placeholder="مثلاً: شراء مقابض حديد" onChange={e => setNewExpense({...newExpense, description: e.target.value})} /></div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">حفظ</button>
                <button type="button" onClick={() => setShowExpenseForm(false)} className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Accounting;
