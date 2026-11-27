export type Region = 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';

export interface Category {
  id: string;
  name: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  technique: string;
  artisanId: string;
  location: string;
  region: Region;
  badge?: string;
  active?: boolean;
  materials?: string;
  story?: string;
}

export interface Artisan {
  id: string;
  name: string;
  brand: string;
  craft: string;
  location: string;
  region: Region;
  rating: number;
  reviews: number;
  initials: string;
  color: string;
  cover: string;
  avatar?: string;
  story: string;
  techniques: string[];
  processPhotos: { src: string; caption: string }[];
  productIds: string[];
}

export interface Fair {
  id: string;
  name: string;
  city: string;
  state: string;
  region: Region;
  date: string;
  distanceKm: number;
  image: string;
  description: string;
  demo?: boolean;
  lat?: number;
  lng?: number;
  coordsApprox?: boolean;
}

export type BrandTemplate = 'artesanal' | 'minimalista' | 'colorido' | 'elegante' | 'rustico';
export type BrandFont = 'serifada' | 'moderna' | 'manuscrita';

export interface BrandCollection {
  id: string;
  name: string;
  productIds: string[];
}

export interface BrandTheme {
  template: BrandTemplate;
  primary: string;
  secondary: string;
  background: string;
  accent: string;
  font: BrandFont;
  logo?: string;
  avatar?: string;
  cover?: string;
  slogan?: string;
  description?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  techniques?: string[];
  featuredProductIds?: string[];
  collections?: BrandCollection[];
  atelierPhotos?: string[];
}

export type CommissionStatus =
  | 'solicitacao'
  | 'em_analise'
  | 'proposta'
  | 'aguardando_aprovacao'
  | 'aprovada'
  | 'em_producao'
  | 'pronta_envio'
  | 'enviada'
  | 'concluida'
  | 'cancelada';

export interface Commission {
  id: string;
  artisanId: string;
  buyerName: string;
  productId?: string;
  productName?: string;
  description: string;
  colors?: string;
  dimensions?: string;
  quantity: number;
  customizations?: string;
  deadline?: string;
  budget?: string;
  referenceImage?: string;
  status: CommissionStatus;
  proposedPrice?: number;
  proposedDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  from: 'comprador' | 'produtora' | 'sistema';
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  artisanId: string;
  productId?: string;
  productName?: string;
  buyerName: string;
  messages: ChatMessage[];
  unread: number;
  updatedAt: string;
}

export interface PostComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passHash: string;
  role: 'comprador' | 'produtora' | 'ambos';
  brandName?: string;
  location?: string;
  createdAt: string;
}
