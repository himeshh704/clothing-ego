export type CategoryTab = 'women' | 'men' | 'clearance';

export interface ColorSwatch {
  name: string;
  colorHex: string;
}

export interface Product {
  id: string;
  title: string;
  category: CategoryTab;
  price: number;
  compareAtPrice: number;
  emiText: string;
  imagePrimary: string;
  imageSecondary: string;
  badge?: 'SALE' | 'NEW' | 'SAVE 20+' | 'BEST SELLER';
  swatches: ColorSwatch[];
  sizes: string[];
}
