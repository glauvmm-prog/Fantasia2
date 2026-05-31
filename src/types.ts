export interface Costume {
  id: string; // uuid in Supabase
  name: string;
  decade: '80s' | '90s';
  category: string;
  type: 'rental' | 'sale' | 'both';
  price_sale: number | null;
  price_rental: number | null;
  size: 'PP' | 'P' | 'M' | 'G' | 'GG';
  status: 'available' | 'rented' | 'sold' | 'maintenance';
  stock: number;
  image_url: string;
  description: string;
  created_at?: string;
}

export interface Transaction {
  id: string; // uuid in Supabase
  costume_id: string;
  costume_name?: string; // Cache or join
  type: 'rental' | 'sale';
  customer_name: string;
  customer_phone: string;
  transaction_date: string;
  due_date: string | null; // For rentals
  return_date: string | null; // For completed rentals
  total_value: number;
  status: 'active' | 'completed' | 'overdue';
  created_at?: string;
}

export interface SupabaseConfig {
  url: string;
  anon_key: string;
  is_connected: boolean;
}
