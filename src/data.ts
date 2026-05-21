/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Publisher, SmartLink, DailyReport, PaymentPayout } from './types';

// Translation dictionary
export const translations: Record<string, { en: string; ur: string }> = {
  // Navigation / Tabs
  adminDashboard: { en: "Admin Dashboard", ur: "ایڈمن ڈیش بورڈ" },
  publisherDashboard: { en: "Publisher Dashboard", ur: "پبلیشر ڈیش بورڈ" },
  smartLinks: { en: "Smart Links", ur: "سمارٹ لنکس" },
  publishers: { en: "Manage Publishers", ur: "پبلیشرز ٹیم" },
  dailyReports: { en: "Daily Earnings Report", ur: "روزانہ کا حساب" },
  payoutCalculator: { en: "Payout Calculator", ur: "پے آؤٹ کیلکولیٹر" },
  paymentHistory: { en: "Payment History", ur: "ادائیگیوں کی تاریخ" },

  // Role Swapper
  currentRole: { en: "Selected Mode: ", ur: "منتخب موڈ: " },
  adminMode: { en: "Admin Mode", ur: "ایڈمن موڈ" },
  publisherMode: { en: "Publisher Mode", ur: "پبلیشر موڈ" },
  selectPublisherToView: { en: "Select Publisher to view panel:", ur: "پینل دیکھنے کے لیے پبلیشر منتخب کریں:" },

  // Statistics Cards
  dailyImpressions: { en: "Daily Impressions", ur: "روزانہ کے امپریشنز" },
  dailyEarnings: { en: "Daily Earnings", ur: "روزانہ کی کمائی" },
  monthlyImpressions: { en: "Monthly Impressions", ur: "مہینے کے امپریشنز" },
  monthlyEarnings: { en: "Monthly Earnings", ur: "پورے مہینے کی کمائی" },
  publisherShare: { en: "Publisher Share", ur: "پبلیشر کا حصہ" },
  adminEarnings: { en: "Admin Earnings", ur: "ایڈمن کا منافع" },
  pendingPayout: { en: "Pending Balance", ur: "بقایا رقم" },
  totalPaid: { en: "Total Paid Out", ur: "کل ادائیگی" },
  currencyUSD: { en: "USD ($)", ur: "ڈالر ($)" },
  currencyPKR: { en: "PKR (Rs.)", ur: "پاکستانی روپیہ (Rs.)" },

  // Forms / Actions
  addNewPublisher: { en: "Add New Publisher", ur: "نیا پبلیشر شامل کریں" },
  addNewSmartLink: { en: "Add Smart Link", ur: "نیا سمارٹ لنک شامل کریں" },
  addDailyReport: { en: "Record Traffic Status", ur: "روزانہ رپورٹ درج کریں" },
  publisherName: { en: "Publisher Name", ur: "پبلیشر کا نام" },
  contactInfo: { en: "Contact Info", ur: "رابطہ نمبر / اکاؤنٹ" },
  payoutRatePct: { en: "Payout Share %", ur: "پبلیشر کا حصہ %" },
  paymentMethod: { en: "Payment Method", ur: "ادائیگی کا طریقہ" },
  paymentDetails: { en: "Payment Details / Wallet", ur: "ادائیگی کی تفصیل / موبائل نمبر" },
  linkName: { en: "Link Name", ur: "لنک کا نام" },
  adsterraUrl: { en: "Ad Company Link (Adsterra)", ur: "ایڈ کمپنی کا لنک (Adsterra)" },
  assignedPublisher: { en: "Assign to Publisher", ur: "پبلیشر کو تفویض کریں" },
  impressionsCount: { en: "Impressions Count", ur: "امپریشنز کی تعداد" },
  totalRevenueUSD: { en: "Total Earnings from Company ($)", ur: "کمپنی سے حاصل کل کمائی (ڈالر)" },
  date: { en: "Date", ur: "تاریخ" },
  save: { en: "Save", ur: "محفوظ کریں" },
  cancel: { en: "Cancel", ur: "کینسل" },
  copyLink: { en: "Copy Smart Link", ur: "لنک کاپی کریں" },
  copied: { en: "Copied!", ur: "کاپی ہو گیا!" },

  // Calculator Urdu/English
  calcHeader: { en: "Automated Payout Calculator", ur: "آٹومیٹک پے آؤٹ کیلکولیٹر" },
  payoutCalculatorDesc: { en: "Calculate custom publisher payouts based on custom Adsterra earnings and split percentage.", ur: "کمپنی کی کمائی اور مقررہ فیصد کے مطابق پین ایڈوانس پے آؤٹ کا حساب لگائیں۔" },
  selectPublisher: { en: "Select Publisher:", ur: "پبلیشر منتخب کریں:" },
  enterRawRevenue: { en: "Adsterra/Company Total Earnings ($):", ur: "ایڈ کمپنی کی کل کمائی لکھیں ($):" },
  payoutRateUsed: { en: "Publisher Policy rate:", ur: "پبلیشر کی پالیسی فیصد:" },
  calculatedPayoutAmount: { en: "Calculated Publisher Share ($):", ur: "پبلیشر کی بنے والی رقم ($):" },
  pkrConversionEstimate: { en: "PKR Conversion Est (1$ = Rs. 280):", ur: "پاکستانی روپے میں تخمینہ (1$ = 280 روپے):" },
  recordPayoutEntry: { en: "Disburse Payment & Record History", ur: "رقم ادا کریں اور ہسٹری میں درج کریں" },

  // Tables Headers & Fields
  actions: { en: "Actions", ur: "اقدامات" },
  amount: { en: "Amount", ur: "رقم" },
  status: { en: "Status", ur: "حالت" },
  details: { en: "Details", ur: "تفصیل" },
  active: { en: "Active", ur: "فعال" },
  inactive: { en: "Inactive", ur: "غیر فعال" },
  paid: { en: "Paid", ur: "رقم بھیج دی" },
  pending: { en: "Pending", ur: "بقایا" },
  approve: { en: "Approve", ur: "منظور کریں" },
  viewInvoice: { en: "View Invoice Receipt", ur: "رسید دیکھیں" },
  invoiceTitle: { en: "Payment Receipt Slip", ur: "ادائیگی کی باضابطہ رسید" },

  // Additional Helpful Prompts
  noData: { en: "No records found.", ur: "کوئی ریکارڈ نہیں ملا۔" },
  latestDailyEarningHistory: { en: "Daily Earnings Trend (USD)", ur: "روزانہ کی کمائی کا چارٹ" },
  quickStats: { en: "Quick Stats Summary", ur: "اعداد و شمار کا خلاصہ" },
  distributedLinksTracker: { en: "Links Assigned to You", ur: "آپ کے تفویض کردہ لنکس" },
  trackEarningsDesc: { en: "This panel simulates what your publisher team sees. They can track their own daily/monthly earnings.", ur: "یہ پینل پبلیشر ٹیم کا ہے۔ پبلیشر اپنے تفویض کردہ لنکس، روزانہ اور مہینے کی کمائی دیکھ سکتے ہیں۔" },
  quickTip: { en: "Tip: Switch to Admin Mode to manage team members and smart links.", ur: "ٹپ: ٹیم ممبرز اور سمارٹ لنکس کا انتظام کرنے کے لیے ایڈمن موڈ پر جائیں۔" }
};

// Initial Seed Data 
export const initialPublishers: Publisher[] = [
  {
    id: "pub_1",
    name: "Ali Raza",
    contact: "WhatsApp: +92 312 4567890",
    joinedDate: "2026-01-10",
    payoutRate: 75, // 75% to Publisher, 25% Admin
    status: 'active',
    paymentMethod: "Easypaisa",
    paymentDetails: "Ali Raza (03124567890)"
  },
  {
    id: "pub_2",
    name: "Hamza Khan",
    contact: "Telegram: @hamza_adsterra",
    joinedDate: "2026-02-15",
    payoutRate: 80, // 80% to Publisher, 20% Admin
    status: 'active',
    paymentMethod: "JazzCash",
    paymentDetails: "Hamza Khan (03009876543)"
  },
  {
    id: "pub_3",
    name: "Ayesha Malik",
    contact: "WhatsApp: +92 301 8887777",
    joinedDate: "2026-03-01",
    payoutRate: 80,
    status: 'active',
    paymentMethod: "USDT TRC20",
    paymentDetails: "TYkG7fX9N1Sshz8RzG1Qv8vCdf3Z7Msp3A"
  },
  {
    id: "pub_4",
    name: "Siddique Butt",
    contact: "WhatsApp: +92 345 5556677",
    joinedDate: "2026-04-12",
    payoutRate: 70, // 70% to Publisher, 30% Admin
    status: 'active',
    paymentMethod: "Bank Transfer",
    paymentDetails: "HBL - Account: 1234-5678-9012-34 - Title: Muhammad Siddique"
  }
];

export const initialSmartLinks: SmartLink[] = [
  {
    id: "link_11",
    name: "Adsterra High CPM Direct Link 1",
    sourceCompany: "Adsterra",
    originalUrl: "https://landing-pages.adsterra.com/direct/8274619?subid=AliRaza",
    assignedPublisherId: "pub_1",
    createdDate: "2026-05-01",
    status: 'active'
  },
  {
    id: "link_12",
    name: "Pakistan FB Social Traffic Adsterra",
    sourceCompany: "Adsterra",
    originalUrl: "https://landing-pages.adsterra.com/direct/9201948?subid=AliRazaSocial",
    assignedPublisherId: "pub_1",
    createdDate: "2026-05-10",
    status: 'active'
  },
  {
    id: "link_21",
    name: "Mainstream Direct Link 2",
    sourceCompany: "Adsterra",
    originalUrl: "https://landing-pages.adsterra.com/direct/9118321?subid=HamzaKhan",
    assignedPublisherId: "pub_2",
    createdDate: "2026-05-05",
    status: 'active'
  },
  {
    id: "link_31",
    name: "High CPM Popunder Link",
    sourceCompany: "Adsterra",
    originalUrl: "https://landing-pages.adsterra.com/direct/4521839?subid=AyeshaMalik",
    assignedPublisherId: "pub_3",
    createdDate: "2026-05-02",
    status: 'active'
  },
  {
    id: "link_41",
    name: "Bypass Proxy Direct Link Adsterra",
    sourceCompany: "Adsterra",
    originalUrl: "https://landing-pages.adsterra.com/direct/2718392?subid=SiddiqueButt",
    assignedPublisherId: "pub_4",
    createdDate: "2026-05-12",
    status: 'active'
  }
];

// Seed Daily Reports for last 7 days of May 2026
export const initialDailyReports: DailyReport[] = [
  // May 15
  { id: "rep_101", date: "2026-05-15", publisherId: "pub_1", linkId: "link_11", impressions: 12400, rawEarnings: 31.00, publisherShare: 23.25, status: 'approved' },
  { id: "rep_102", date: "2026-05-15", publisherId: "pub_2", linkId: "link_21", impressions: 8500, rawEarnings: 25.50, publisherShare: 20.40, status: 'approved' },
  { id: "rep_103", date: "2026-05-15", publisherId: "pub_3", linkId: "link_31", impressions: 15100, rawEarnings: 45.30, publisherShare: 36.24, status: 'approved' },
  { id: "rep_104", date: "2026-05-15", publisherId: "pub_4", linkId: "link_41", impressions: 5300, rawEarnings: 10.60, publisherShare: 7.42, status: 'approved' },

  // May 16
  { id: "rep_201", date: "2026-05-16", publisherId: "pub_1", linkId: "link_11", impressions: 14200, rawEarnings: 35.50, publisherShare: 26.63, status: 'approved' },
  { id: "rep_202", date: "2026-05-16", publisherId: "pub_1", linkId: "link_12", impressions: 9300, rawEarnings: 18.60, publisherShare: 13.95, status: 'approved' },
  { id: "rep_203", date: "2026-05-16", publisherId: "pub_2", linkId: "link_21", impressions: 10100, rawEarnings: 30.30, publisherShare: 24.24, status: 'approved' },
  { id: "rep_204", date: "2026-05-16", publisherId: "pub_3", linkId: "link_31", impressions: 16200, rawEarnings: 48.60, publisherShare: 38.88, status: 'approved' },

  // May 17
  { id: "rep_301", date: "2026-05-17", publisherId: "pub_1", linkId: "link_11", impressions: 11000, rawEarnings: 27.50, publisherShare: 20.63, status: 'approved' },
  { id: "rep_302", date: "2026-05-17", publisherId: "pub_2", linkId: "link_21", impressions: 7200, rawEarnings: 21.60, publisherShare: 17.28, status: 'approved' },
  { id: "rep_303", date: "2026-05-17", publisherId: "pub_3", linkId: "link_31", impressions: 14000, rawEarnings: 42.00, publisherShare: 33.60, status: 'approved' },
  { id: "rep_304", date: "2026-05-17", publisherId: "pub_4", linkId: "link_41", impressions: 6800, rawEarnings: 13.60, publisherShare: 9.52, status: 'approved' },

  // May 18
  { id: "rep_401", date: "2026-05-18", publisherId: "pub_1", linkId: "link_11", impressions: 16500, rawEarnings: 41.25, publisherShare: 30.94, status: 'approved' },
  { id: "rep_402", date: "2026-05-18", publisherId: "pub_1", linkId: "link_12", impressions: 11200, rawEarnings: 22.40, publisherShare: 16.80, status: 'approved' },
  { id: "rep_403", date: "2026-05-18", publisherId: "pub_2", linkId: "link_21", impressions: 11800, rawEarnings: 35.40, publisherShare: 28.32, status: 'approved' },
  { id: "rep_404", date: "2026-05-18", publisherId: "pub_3", linkId: "link_31", impressions: 18400, rawEarnings: 55.20, publisherShare: 44.16, status: 'approved' },

  // May 19
  { id: "rep_501", date: "2026-05-19", publisherId: "pub_1", linkId: "link_11", impressions: 15300, rawEarnings: 38.25, publisherShare: 28.69, status: 'approved' },
  { id: "rep_502", date: "2026-05-19", publisherId: "pub_2", linkId: "link_21", impressions: 9800, rawEarnings: 29.40, publisherShare: 23.52, status: 'approved' },
  { id: "rep_503", date: "2026-05-19", publisherId: "pub_3", linkId: "link_31", impressions: 17200, rawEarnings: 51.60, publisherShare: 41.28, status: 'approved' },
  { id: "rep_504", date: "2026-05-19", publisherId: "pub_4", linkId: "link_41", impressions: 8100, rawEarnings: 16.20, publisherShare: 11.34, status: 'approved' },

  // May 20
  { id: "rep_601", date: "2026-05-20", publisherId: "pub_1", linkId: "link_11", impressions: 18900, rawEarnings: 47.25, publisherShare: 35.44, status: 'approved' },
  { id: "rep_602", date: "2026-05-20", publisherId: "pub_1", linkId: "link_12", impressions: 12500, rawEarnings: 25.00, publisherShare: 18.75, status: 'approved' },
  { id: "rep_603", date: "2026-05-20", publisherId: "pub_2", linkId: "link_21", impressions: 13000, rawEarnings: 39.00, publisherShare: 31.20, status: 'approved' },
  { id: "rep_604", date: "2026-05-20", publisherId: "pub_3", linkId: "link_31", impressions: 19100, rawEarnings: 57.30, publisherShare: 45.84, status: 'approved' },
  { id: "rep_605", date: "2026-05-20", publisherId: "pub_4", linkId: "link_41", impressions: 9400, rawEarnings: 18.80, publisherShare: 13.16, status: 'approved' },

  // May 21 (Today)
  { id: "rep_701", date: "2026-05-21", publisherId: "pub_1", linkId: "link_11", impressions: 13200, rawEarnings: 33.00, publisherShare: 24.75, status: 'pending' },
  { id: "rep_702", date: "2026-05-21", publisherId: "pub_2", linkId: "link_21", impressions: 8900, rawEarnings: 26.70, publisherShare: 21.36, status: 'pending' },
  { id: "rep_703", date: "2026-05-21", publisherId: "pub_3", linkId: "link_31", impressions: 14500, rawEarnings: 43.50, publisherShare: 34.80, status: 'pending' }
];

export const initialPayouts: PaymentPayout[] = [
  {
    id: "pay_1",
    publisherId: "pub_1",
    amount: 155.00,
    amountPKR: 43400,
    date: "2026-05-10",
    method: "Easypaisa",
    details: "Ali Raza (03124567890)",
    status: 'paid',
    txid: "EP-91823901A",
    notes: "Adsterra Paid Out (May Week 1)"
  },
  {
    id: "pay_2",
    publisherId: "pub_2",
    amount: 120.00,
    amountPKR: 33600,
    date: "2026-05-12",
    method: "JazzCash",
    details: "Hamza Khan (03009876543)",
    status: 'paid',
    txid: "JC-00928318X",
    notes: "Adsterra Paid Out (May Week 1)"
  },
  {
    id: "pay_3",
    publisherId: "pub_3",
    amount: 250.00,
    amountPKR: 70000,
    date: "2026-05-14",
    method: "USDT TRC20",
    details: "TYkG7fX9N1Sshz8RzG1Qv8vCdf3Z7Msp3A",
    status: 'paid',
    txid: "9f7b182cb9e8c7162bd09b1297d02",
    notes: "Direct USDT disbursement"
  },
  {
    id: "pay_4",
    publisherId: "pub_4",
    amount: 80.00,
    amountPKR: 22400,
    date: "2026-05-18",
    method: "Bank Transfer",
    details: "HBL - Title: Muhammad Siddique",
    status: 'pending',
    notes: "Pending approval - weekly check"
  }
];
