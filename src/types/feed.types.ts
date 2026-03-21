/**
 * Feed domain types — RSS items, feed sources, categories.
 */

export type FeedCategory =
  | "reinsurance"
  | "insurance"
  | "gcc"
  | "regulatory"
  | "fraud"
  | "weather"
  | "cyber"
  | "market";

export interface FeedItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  timestamp: string;
  regions: string[];
  category: FeedCategory;
  imageUrl?: string;
}

export interface FeedSource {
  name: string;
  url: string;
  region: string;
  category: FeedCategory;
  active: boolean;
}

export interface FeedState {
  items: FeedItem[];
  unreadCount: number;
  activeTab: FeedCategory | "all";
  autoScroll: boolean;
}
