export interface Ingredient {
  id: number | string;
  name: string;
  imageUrl?: string;
  description?: string;
  type?: string;
  abv?: number; // alcool ??
  containsAlcohol?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
