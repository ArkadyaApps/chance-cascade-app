export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  ticketPrice: number;
  ticketsRequired: number;
  ticketsSold: number;
  category: string;
  drawDate: string;
  featured?: boolean;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    description: "Latest flagship smartphone with titanium design, A17 Pro chip, and advanced camera system",
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"],
    ticketPrice: 1,
    ticketsRequired: 200,
    ticketsSold: 150,
    category: "Electronics",
    drawDate: "2025-11-08T20:00:00Z",
    featured: true,
  },
  {
    id: "2",
    name: "MacBook Pro 16\"",
    description: "Powerful M3 Max chip, stunning Liquid Retina XDR display, and all-day battery life",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"],
    ticketPrice: 2,
    ticketsRequired: 300,
    ticketsSold: 245,
    category: "Electronics",
    drawDate: "2025-11-08T20:00:00Z",
  },
  {
    id: "3",
    name: "PlayStation 5 Bundle",
    description: "PS5 console with 2 controllers and 3 AAA games included",
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800"],
    ticketPrice: 1,
    ticketsRequired: 150,
    ticketsSold: 98,
    category: "Gaming",
    drawDate: "2025-11-09T20:00:00Z",
  },
  {
    id: "4",
    name: "AirPods Pro",
    description: "Active noise cancellation, adaptive audio, and personalized spatial audio",
    images: ["https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800"],
    ticketPrice: 1,
    ticketsRequired: 100,
    ticketsSold: 67,
    category: "Electronics",
    drawDate: "2025-11-09T20:00:00Z",
  },
];

export interface WalletTransaction {
  id: string;
  type: "purchase" | "spend" | "win";
  amount: number;
  description: string;
  timestamp: string;
}

export const mockWalletBalance = 25;

export const mockTransactions: WalletTransaction[] = [
  {
    id: "1",
    type: "purchase",
    amount: 50,
    description: "Purchased 50 tickets",
    timestamp: "2025-11-04T10:30:00Z",
  },
  {
    id: "2",
    type: "spend",
    amount: -10,
    description: "Entered draw: iPhone 15 Pro Max",
    timestamp: "2025-11-04T14:20:00Z",
  },
  {
    id: "3",
    type: "spend",
    amount: -15,
    description: "Entered draw: MacBook Pro 16\"",
    timestamp: "2025-11-05T09:15:00Z",
  },
];

export interface UserEntry {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  ticketsSpent: number;
  drawDate: string;
  status: "active" | "won" | "lost";
}

export const mockUserEntries: UserEntry[] = [
  {
    id: "1",
    productId: "1",
    productName: "iPhone 15 Pro Max",
    productImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    ticketsSpent: 10,
    drawDate: "2025-11-08T20:00:00Z",
    status: "active",
  },
  {
    id: "2",
    productId: "2",
    productName: "MacBook Pro 16\"",
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    ticketsSpent: 15,
    drawDate: "2025-11-08T20:00:00Z",
    status: "active",
  },
];
