export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  featured: boolean;
  super_featured: boolean;
  one_per_user: boolean;
  stock: number;
  black_market: boolean;
}
