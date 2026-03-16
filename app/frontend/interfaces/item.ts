export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  featured: boolean;
  one_per_user: boolean;
}
