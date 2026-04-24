export interface Review {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  rating: number;
  featured?: boolean;
  type?: 'review' | 'comparativo';
  content?: string;

  // Novos campos para conversão
  benefits?: string[];
  pros?: string[];
  cons?: string[];
  forWhom?: string;
  buyLink?: string;
  buyPrice?: string;

  // Campos para Comparativo (Produto 2)
  product2Name?: string;
  product2Rating?: string;
  product2Pros?: string[];
  product2Cons?: string[];
  product2Link?: string;
  product2Price?: string;
  product2Image?: string;
  comparisonSpecs?: { label: string; p1: string; p2: string }[];
}

export interface Deal {
  id: string;
  title: string;
  slug?: string;
  price: string;
  originalPrice: string;
  discount: string;
  store: string;
  link: string;
  image: string;
  views?: number;
  isAchadinho?: boolean;

  // Campos para Landing Page de Oferta
  urgencyText?: string;
  endsInHours?: number;
  features?: string[];
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tagline?: string; // Ex: "Melhores gadgets baratos"
}

export interface ComparisonItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image1: string;
  image2: string;
  item1Name: string;
  item2Name: string;
}
