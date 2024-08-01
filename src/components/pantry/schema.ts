export type NewPantryItem = {
  name: string;
  quantity: number;
};

export type PantryItem = NewPantryItem & {
  id: string;
};