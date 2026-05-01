export type Creator = {
  id: string;
  name: string;
  handle?: string;
  avatar?: string;
  image?: string;
  category?: string;

  price?: number;

  rating?: number;
  reviewCount?: number;
  responseTime?: string;

  deliveryHours?: number;

  isVerified?: boolean;
  isFeatured?: boolean;

  title?: string;
};

export interface Drop {
  id: string;
  title: string;
  description: string;
  category: string;

  image: string;
  edition: string;

  creatorName: string;
  creatorAvatar: string;

  currentBid: number;
  buyNowPrice: number | null;
  totalBids: number;

  endsIn: string; // ISO date string
}

export interface Experience {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  duration: string;
  capacity: number;
  spotsLeft: number;
  pricingMode: "buyNow" | "auction" | "both";
  buyNowPrice: number | null;
  currentBid: number | null;
  endsIn: string | null;
  category: string;
  tags: string[];
}

export interface HowItWorksStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
}