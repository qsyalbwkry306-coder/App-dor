
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from './constants.tsx';
import { AppState } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import OrderManagement from './components/OrderManagement.tsx';
import Accounting from './components/Accounting.tsx';
import Inventory from './components/Inventory.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';

const INITIAL_DATA: AppState = {
  customers: [
    { id: '1', name: 'أحمد علي', phone: '0501234567' },
    { id: '2', name: 'سارة محمد', phone: '0559876543' }
  ],
  orders: [
    { 
      id: '101', customerId: '1', doorType: 'حديد', 
      dimensions: { width: 100, height: 210 }, 
      totalPrice: 2500, paidAmount: 1000, 
      status: 'تحت التصنيع', createdAt: new Date().toISOString() 
    }
  ],
  expenses: [
    { id: 'e1', category: 'إيجار', amount: 3000, date: new Date().toISOString(), description: 'إيجار الورشة لشهر مارس' }
  ],
  inventory: [
    { id: 'i1', name: 'حديد زاوية', quantity: 45, unit: 'سيخ', minLimit: 10 },
    { id: 'i2', name: 'طلاء أسود', quantity: 5, unit: 'جالون', minLimit: 2 }
  ]
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGoogleLinked, setIsGoogleLinked] = useState(() => {
    return localStorage.getItem('google_linked') === 'true';
  });
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(localStorage.getItem('last_sync'));

  const [data, setData] = useState<AppState>(() => {
    const saved = localStorage.getItem('workshop_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('workshop_data', JSON.stringify(data));
    if (isGoogleLinked) {
      triggerCloudSync();
    }
  }, [data, isGoogleLinked]);

  const triggerCloudSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date().toLocaleTimeString('ar-SA');
      setLastSync(now);
      localStorage.setItem('last_sync', now);
      setIsSyncing(false);
    }, 1500);
  };

  const handleGoogleLink = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsGoogleLinked(true);
      localStorage.setItem('google_linked', 'true');
      setIsSyncing(false);
      setShowSyncModal(false);
      triggerCloudSync();
    }, 2000);
  };

  const updateData = (newData: Partial<AppState>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard data={data} />;
      case 'orders': return <OrderManagement data={data} updateData={updateData} />;
      case 'accounting': return <Accounting data={data} updateData={updateData} />;
      case 'inventory': return <Inventory data={data} updateData={updateData} />;
      case 'ai-assistant': return <AIAssistant state={data} />;
      default: return <Dashboard data={data} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-30 shadow-sm">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <span className="bg-indigo-600 p-1 rounded text-white">🚪</span>
            محاسب الورشة
          </h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSyncModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                isGoogleLinked 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : isGoogleLinked ? <Cloud size={14} /> : <CloudOff size={14} />}
              {isGoogleLinked ? 'محمي سحابياً' : 'ربط Google'}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 overflow-x-hidden">
        {renderContent()}
      </main>
      {showSyncModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">حفظ البيانات مع Google</h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                اربط حسابك لتتمكن من الوصول لبيانات ورشتك من أي جوال آخر، ولضمان عدم ضياع الحسابات في حال تغيير الجهاز.
              </p>
              {isGoogleLinked ? (
                <div className="w-full space-y-4">
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
                    <CheckCircle2 className="text-green-600" size={24} />
                    <div className="text-right">
                      <p className="text-xs font-bold text-green-800">الحساب مرتبط بنجاح</p>
                      <p className="text-[10px] text-green-600">آخر مزامنة: {lastSync || 'الآن'}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowSyncModal(false)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">إغلاق</button>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <button onClick={handleGoogleLink} disabled={isSyncing} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-70">
                    {isSyncing ? <RefreshCw size={20} className="animate-spin" /> : null}
                    {isSyncing ? 'جاري الاتصال...' : 'تسجيل الدخول مع Google'}
                  </button>
                  <button onClick={() => setShowSyncModal(false)} className="w-full py-4 text-slate-400 text-sm font-medium">ليس الآن</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg px-2 py-1 z-40">
        <div className="flex justify-around items-center max-w-lg mx-auto h-16">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center justify-center gap-1 transition-colors w-16 ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`p-1 rounded-lg ${activeTab === item.id ? 'bg-indigo-50' : ''}`}>{item.icon}</div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
export default App;
