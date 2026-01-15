
import React, { useState } from 'react';
import { AppState, Order, DoorType } from '../types';
import { Plus, Search, Phone, ChevronRight, Edit2, ArrowUpDown } from 'lucide-react';
import { STATUS_COLORS } from '../constants';

interface Props {
  data: AppState;
  updateData: (newData: Partial<AppState>) => void;
}

type SortOption = 'date-new' | 'date-old' | 'price-high' | 'price-low';

const OrderManagement: React.FC<Props> = ({ data, updateData }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-new');
  
  const [formData, setFormData] = useState<Partial<Order>>({
    doorType: 'حديد',
    status: 'قيد الانتظار',
    dimensions: { width: 0, height: 0 },
    totalPrice: 0,
    paidAmount: 0,
    notes: ''
  });
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const resetForm = () => {
    setFormData({
      doorType: 'حديد', status: 'قيد الانتظار',
      dimensions: { width: 0, height: 0 }, totalPrice: 0,
      paidAmount: 0, notes: ''
    });
    setCustomerName(''); setCustomerPhone(''); setEditingOrder(null);
  };

  const handleOpenEdit = (order: Order) => {
    const customer = data.customers.find(c => c.id === order.customerId);
    setEditingOrder(order); setFormData(order);
    setCustomerName(customer?.name || ''); setCustomerPhone(customer?.phone || '');
    setShowForm(true);
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      const updatedOrders = data.orders.map(o => o.id === editingOrder.id ? { ...o, ...formData } as Order : o);
      const updatedCustomers = data.customers.map(c => c.id === editingOrder.customerId ? { ...c, name: customerName, phone: customerPhone } : c);
      updateData({ orders: updatedOrders, customers: updatedCustomers });
    } else {
      const customerId = Date.now().toString();
      const newCustomer = { id: customerId, name: customerName, phone: customerPhone };
      const orderId = (data.orders.length + 101).toString();
      const order: Order = { ...(formData as Order), id: orderId, customerId, createdAt: new Date().toISOString() };
      updateData({ customers: [...data.customers, newCustomer], orders: [order, ...data.orders] });
    }
    setShowForm(false); resetForm();
  };

  const filteredAndSortedOrders = data.orders
    .filter(o => {
      const customer = data.customers.find(c => c.id === o.customerId);
      return customer?.name.includes(searchTerm) || o.id.includes(searchTerm);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-new': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-old': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-high': return b.totalPrice - a.totalPrice;
        case 'price-low': return a.totalPrice - b.totalPrice;
        default: return 0;
      }
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 text-slate-400" size={18} />
            <input type="text" placeholder="بحث عن طلب أو عميل..." className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
            <Plus size={24} />
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 shrink-0 ml-2"><ArrowUpDown size={14} /> فرز حسب:</div>
          <button onClick={() => setSortBy('date-new')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${sortBy === 'date-new' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}>الأحدث</button>
          <button onClick={() => setSortBy('price-high')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${sortBy === 'price-high' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}>الأعلى سعراً</button>
          <button onClick={() => setSortBy('price-low')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${sortBy === 'price-low' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}>الأقل سعراً</button>
        </div>
      </div>
      <div className="space-y-3">
        {filteredAndSortedOrders.map(order => {
          const customer = data.customers.find(c => c.id === order.customerId);
          return (
            <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 group relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800">{customer?.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Phone size={12} /> {customer?.phone}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] px-2 py-1 rounded-full border ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 py-2 border-y border-slate-50">
                <div className="flex-1"><p className="text-[10px] text-slate-400 uppercase font-bold">النوع</p><p className="text-sm font-semibold">{order.doorType}</p></div>
                <div className="flex-1"><p className="text-[10px] text-slate-400 uppercase font-bold">المقاس</p><p className="text-sm font-semibold">{order.dimensions.width}×{order.dimensions.height}</p></div>
                <div className="flex-1 text-left"><p className="text-[10px] text-slate-400 uppercase font-bold">السعر</p><p className="text-sm font-bold text-indigo-600">{order.totalPrice} ر.س</p></div>
              </div>
              {order.notes && <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border-r-2 border-indigo-300 line-clamp-2">{order.notes}</p>}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">متبقي: <span className="text-red-500 font-bold">{order.totalPrice - order.paidAmount} ر.س</span></span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(order)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Edit2 size={16} /></button>
                  <button className="text-indigo-600 font-bold flex items-center gap-1 px-2">التفاصيل <ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredAndSortedOrders.length === 0 && <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">لا توجد نتائج مطابقة لبحثك</div>}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] p-6 animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{editingOrder ? 'تعديل الطلب' : 'طلب جديد'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 p-2">إغلاق</button>
            </div>
            <form onSubmit={handleSaveOrder} className="space-y-4 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar pb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">بيانات العميل</label>
                <input required placeholder="اسم العميل" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-500 transition-colors" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                <input required placeholder="رقم الهاتف" type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-500 transition-colors" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">تفاصيل الباب والحالة</label>
                <div className="flex gap-2">
                  <select className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none" value={formData.doorType} onChange={e => setFormData({...formData, doorType: e.target.value as DoorType})}>
                    <option value="حديد">حديد</option><option value="خشب">خشب</option><option value="ألمنيوم">ألمنيوم</option><option value="ليزر">ليزر</option>
                  </select>
                  <select className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="قيد الانتظار">قيد الانتظار</option><option value="تحت التصنيع">تحت التصنيع</option><option value="تم التركيب">تم التركيب</option><option value="ملغي">ملغي</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2"><label className="text-[10px] text-slate-400 mr-2">العرض (سم)</label><input required type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl" value={formData.dimensions?.width} onChange={e => setFormData({...formData, dimensions: {...formData.dimensions!, width: +e.target.value}})} /></div>
                  <div className="w-1/2"><label className="text-[10px] text-slate-400 mr-2">الارتفاع (سم)</label><input required type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl" value={formData.dimensions?.height} onChange={e => setFormData({...formData, dimensions: {...formData.dimensions!, height: +e.target.value}})} /></div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">المالية (ريال)</label>
                <div className="flex gap-2">
                  <div className="w-1/2"><label className="text-[10px] text-slate-400 mr-2">السعر الإجمالي</label><input required type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl" value={formData.totalPrice} onChange={e => setFormData({...formData, totalPrice: +e.target.value})} /></div>
                  <div className="w-1/2"><label className="text-[10px] text-slate-400 mr-2">المبلغ المدفوع</label><input required type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl" value={formData.paidAmount} onChange={e => setFormData({...formData, paidAmount: +e.target.value})} /></div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">ملاحظات إضافية</label>
                <textarea placeholder="أدخل أي ملاحظات خاصة بالطلب هنا..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-500 transition-colors min-h-[80px] text-sm" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all">{editingOrder ? 'تحديث البيانات' : 'حفظ الطلب الجديد'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default OrderManagement;
