export interface Product {      // this is for product output after product is created
  product_id: number;
  category_id: number;
  name: string;
  description: string | null;   // why null our database can return description as null so we accept both
  price: number;
  stock: number;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductInput {          // this is for creating the  product it doen not contain product_id
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
}