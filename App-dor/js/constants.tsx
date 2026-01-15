
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DoorOpen, 
  Wallet, 
  Package, 
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={20} /> },
  { id: 'orders', label: 'الطلبات', icon: <DoorOpen size={20} /> },
  { id: 'accounting', label: 'الحسابات', icon: <Wallet size={20} /> },
  { id: 'inventory', label: 'المخزن', icon: <Package size={20} /> },
];

export const STATUS_COLORS = {
  'قيد الانتظار': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'تحت التصنيع': 'bg-blue-100 text-blue-700 border-blue-200',
  'تم التركيب': 'bg-green-100 text-green-700 border-green-200',
  'ملغي': 'bg-red-100 text-red-700 border-red-200',
};
