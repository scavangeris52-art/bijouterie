// ─── Locale ───────────────────────────────────────────────────────────────────
export type Locale = "fr" | "en" | "ar" | "es";

// ─── Product ──────────────────────────────────────────────────────────────────
export interface Product {
  id:           string;
  slug:         string;
  sku:          string;
  nameFr:       string;
  nameEn:       string;
  nameAr:       string;
  nameEs:       string;
  descFr:       string;
  descEn:       string;
  descAr:       string;
  descEs:       string;
  price:        number;
  comparePrice: number | null;
  stock:        number;
  material:     string | null;
  stone:        string | null;
  weight:       string | null;
  featured:     boolean;
  published:    boolean;
  categoryId:   string;
  category:     Category;
  images:       ProductImage[];
  reviews?:     Review[];
  createdAt:    string;
  updatedAt:    string;
}

export interface ProductImage {
  id:        string;
  url:       string;
  alt:       string;
  order:     number;
  productId: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id:      string;
  slug:    string;
  nameFr:  string;
  nameEn:  string;
  nameAr:  string;
  nameEs:  string;
  image:   string | null;
  order:   number;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface Order {
  id:              string;
  orderNumber:     string;
  status:          OrderStatus;
  customerName:    string;
  customerEmail:   string;
  customerPhone:   string;
  shippingAddress: string;
  shippingCity:    string;
  shippingZip:     string;
  shippingMethod:  string;
  subtotal:        number;
  shippingCost:    number;
  total:           number;
  paymentId:       string | null;
  paidAt:          string | null;
  notes:           string | null;
  items:           OrderItem[];
  createdAt:       string;
  updatedAt:       string;
}

export interface OrderItem {
  id:        string;
  quantity:  number;
  price:     number;
  productId: string;
  product:   Product;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Review {
  id:          string;
  rating:      number;
  comment:     string;
  authorName:  string;
  authorEmail: string;
  status:      ReviewStatus;
  productId:   string;
  product?:    Product;
  createdAt:   string;
  updatedAt:   string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id:         string;
  slug:       string;
  titleFr:    string;
  titleEn:    string;
  titleAr:    string;
  titleEs:    string;
  excerptFr:  string;
  excerptEn:  string;
  excerptAr:  string;
  excerptEs:  string;
  contentFr:  string;
  contentEn:  string;
  contentAr:  string;
  contentEs:  string;
  coverImage: string | null;
  published:  boolean;
  tags:       string[];
  createdAt:  string;
  updatedAt:  string;
}

// ─── Checkout ─────────────────────────────────────────────────────────────────
export interface CheckoutFormData {
  firstName:  string;
  lastName:   string;
  email:      string;
  phone:      string;
  address:    string;
  city:       string;
  zip:        string;
  shipping:   "standard" | "express";
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?:    T;
  error?:   string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data:    T[];
  total:   number;
  page:    number;
  limit:   number;
  pages:   number;
}
