export type UserProfile = {
  name: string;
  photoUrl: string;
  gender: 'male' | 'female' | 'other' | '';
  age: number | string;
  skinTone: string;
  bodyType: string;
  stylePreferences: string[];
  occasionTypes: string[];
  budget: 'low' | 'medium' | 'high' | '';
};

export type SavedLook = {
  id: string;
  imageUrl: string;
  outfitSuggestion: string;
  itemsList: string[];
  colorPalette: string[];
  accessoryTips: string;
  occasion: string;
};

export type WardrobeItem = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
};

export type Product = {
  name: string;
  price: string;
  url: string;
  imageUrl: string;
};
