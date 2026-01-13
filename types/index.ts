export type Cuisine = 'chinese' | 'biryani';

export type PaymentMethod = 'COD' | 'ONLINE';

export type OrderType = 'delivery' | 'pickup';

export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'completed';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  cuisine: Cuisine;
  category: string;
  image: string;
  availability: boolean;
  description?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSettings {
  kitchenName: string;
  whatsappNumber: string;
  upiQrCode: string;
  upiId: string;
}

export interface CuisineTheme {
  primary: string;
  dark: string;
  accent: string;
  background: string;
  text: string;
}

