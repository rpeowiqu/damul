export interface RecipeTag {
  tagId: number;
  tagName: string;
}

export interface SuggestedRecipe {
  recipeId: number;
  title: string;
  thumbnailUrl: string;
  recipeTags: RecipeTag[];
}
