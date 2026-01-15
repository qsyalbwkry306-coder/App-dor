
export type DoorType = 'حديد' | 'خشب' | 'ألمنيوم' | 'ليزر';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
}

export interface Order {
  id: string;
  customerId: string;
  doorType: DoorType;
  dimensions: { width: number; height: number };
  totalPrice: number;
  paidAmount: number;
  status: 'قيد الانتظar' | 'تحت التصنيع' | 'تم التركيب' | 'ملغي';
  createdAt: string;
  notes?: string;
}

export interface Expense {
  id: string;
  category: 'مواد خام' | 'رواتب' | 'إيجار' | 'صيانة' | 'أخرى';
  amount: number;
  date: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minLimit: number;
}

export interface AppState {
  customers: Customer[];
  orders: Order[];
  expenses: Expense[];
  inventory: InventoryItem[];
}
