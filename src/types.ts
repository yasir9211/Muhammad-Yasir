/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Publisher {
  id: string;
  name: string;
  contact: string; // e.g., "WhatsApp: +923001234567", "@tg_username"
  joinedDate: string;
  payoutRate: number; // custom rev-share %, e.g., 80% (meaning 80% of earnings goes to publisher, 20% to admin)
  status: 'active' | 'inactive';
  paymentMethod: string; // e.g., "Easypaisa", "JazzCash", "USDT TRC20", "Bank Transfer"
  paymentDetails: string;
}

export interface SmartLink {
  id: string;
  name: string;
  sourceCompany: string; // e.g., "Adsterra", "Adsterra Direct", "Monetag", "PropellerAds"
  originalUrl: string; // e.g., "https://display.adsterra.com/..."
  assignedPublisherId: string; // foreign key
  createdDate: string;
  status: 'active' | 'inactive';
}

export interface DailyReport {
  id: string;
  date: string; // "YYYY-MM-DD"
  publisherId: string;
  linkId: string;
  impressions: number;
  rawEarnings: number; // what Adsterra paid (USD)
  publisherShare: number; // what goes to publisher (USD) = rawEarnings * (publisher.payoutRate / 100)
  status: 'pending' | 'approved' | 'paid';
}

export interface PaymentPayout {
  id: string;
  publisherId: string;
  amount: number; // USD
  amountPKR: number; // Converted PKR based on exchange rate (e.g., 1 USD = 280 PKR)
  date: string;
  method: string;
  details: string;
  status: 'paid' | 'pending';
  txid?: string; // transaction hash or receipt code
  notes?: string;
}

export type UserRole = 'admin' | 'publisher';

export interface AppTranslation {
  [key: string]: {
    en: string;
    ur: string;
  };
}
