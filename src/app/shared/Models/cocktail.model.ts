export interface Cocktail {
  created_at: Date;
  id: number | string;
  name: string;
  imageUrl?: string;
  image?: string;
  updated_at?: string;
  description?: string;
  instructions?: string;
  category?: string;
  glass?: string;
  alcoholic?: boolean;

  ingredients?: CocktailIngredient[];
  tags?: string[];
}

export interface CocktailIngredient {
  ingredientId?: number | string;
  name: string;
  measure?: string;
}
