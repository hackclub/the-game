export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  golden_price: number | null;
  real_price: number | null;
  image?: string;
  featured: boolean;
  super_featured: boolean;
  one_per_user: boolean;
  stock: number | null;
  black_market: boolean;
  event_related: boolean;
  grants_platform_access: boolean;
  visible: boolean;
  category: string | null;
}
