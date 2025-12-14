export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rfid_uid: string;
  weight_g: number;
  inStock?: boolean;
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  ingredients?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  addedAt: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  source: 'ESP32' | 'GATEWAY' | 'CLOUD' | 'APP';
  event: string;
  details: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export type ViewMode = 'MOBILE_APP' | 'SYSTEM_DASHBOARD';
export type MobileScreen = 'WELCOME' | 'CART' | 'CHECKOUT' | 'SCAN_CAMERA' | 'SEARCH' | 'FAVORITES' | 'ORDER_SUCCESS' | 'TRACK_ORDER';
export type WebsitePage = 'LANDING' | 'SHOP' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD';

export interface DatabaseTable {
  name: string;
  columns: string[];
  data: any[];
}