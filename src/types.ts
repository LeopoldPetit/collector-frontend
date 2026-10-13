export interface Article {
  id: string;
  title: string;
  description: string;
  price: string;
  shippingCost: string;
  category: string;
  status: string;
  createdAt: string;
}

export interface ArticleInput {
  title: string;
  description: string;
  price: number;
  shippingCost: number;
  category: string;
}
