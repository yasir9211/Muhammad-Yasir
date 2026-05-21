/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  BarChart3,
  Users,
  Link2,
  Calendar,
  Coins,
  History,
  TrendingUp,
  Award,
  DollarSign,
  Wallet,
  ArrowUpRight,
  HelpCircle,
  ShieldCheck,
  UserCheck,
  ArrowDownCircle,
  Sparkles,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

import { Publisher, SmartLink, DailyReport, PaymentPayout, UserRole } from './types';
import {
  translations,
  initialPublishers,
  initialSmartLinks,
  initialDailyReports,
  initialPayouts
} from './data';

import { LanguageSelector } from './components/LanguageSelector';
import { StatCard } from './components/StatCard';
import { PublishersManager } from './components/PublishersManager';
import { SmartLinksManager } from './components/SmartLinksManager';
import { DailyReportsManager } from './components/DailyReportsManager';
import { AutomaticPayoutCalculator } from './components/AutomaticPayoutCalculator';
import { PaymentHistoryManager } from './components/PaymentHistoryManager';

export default function App() {
  // Locale / Language State (defaults to 'ur' Urdu as the prompt was in Urdu, but easy to toggle)
  const [language, setLanguage] = useState<'en' | 'ur'>('ur');
  const t = (key: string) => translations[key]?.[language] || key;
  const isUrdu = language === 'ur';

  // State Management with LocalStorage persistence
  const [publishers, setPublishers] = useState<Publisher[]>(() => {
    const saved = localStorage.getItem('ad_dash_publishers');
    return saved ? JSON.parse(saved) : initialPublishers;
  });

  const [smartLinks, setSmartLinks] = useState<SmartLink[]>(() => {
    const saved = localStorage.getItem('ad_dash_links');
    return saved ? JSON.parse(saved) : initialSmartLinks;
  });

  const [dailyReports, setDailyReports] = useState<DailyReport[]>(() => {
    const saved = localStorage.getItem('ad_dash_reports');
    return saved ? JSON.parse(saved) : initialDailyReports;
  });

  const [payouts, setPayouts] = useState<PaymentPayout[]>(() => {
    const saved = localStorage.getItem('ad_dash_payouts');
    return saved ? JSON.parse(saved) : initialPayouts;
  });

  // Current Role
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  // Selected simulated publisher (used when currentRole === 'publisher')
  const [simulatedPubId, setSimulatedPubId] = useState<string>(initialPublishers[0].id);

  // Active sub-tab inside Admin Mode
  const [adminTab, setAdminTab] = useState<'overview' | 'publishers' | 'links' | 'reports' | 'calculator' | 'history'>('overview');

  // Trigger LocalStorage saves
  useEffect(() => {
    localStorage.setItem('ad_dash_publishers', JSON.stringify(publishers));
  }, [publishers]);

  useEffect(() => {
    localStorage.setItem('ad_dash_links', JSON.stringify(smartLinks));
  }, [smartLinks]);

  useEffect(() => {
    localStorage.setItem('ad_dash_reports', JSON.stringify(dailyReports));
  }, [dailyReports]);

  useEffect(() => {
    localStorage.setItem('ad_dash_payouts', JSON.stringify(payouts));
  }, [payouts]);

  // RESET state to seed data
  const handleResetData = () => {
    if (confirm(isUrdu ? "کیا آپ تمام عارضی تبدیلیاں ختم کر کے ڈیٹا ری سیٹ کرنا چاہتے ہیں؟" : "Are you sure you want to restore default seed data?")) {
      localStorage.removeItem('ad_dash_publishers');
      localStorage.removeItem('ad_dash_links');
      localStorage.removeItem('ad_dash_reports');
      localStorage.removeItem('ad_dash_payouts');
      setPublishers(initialPublishers);
      setSmartLinks(initialSmartLinks);
      setDailyReports(initialDailyReports);
      setPayouts(initialPayouts);
    }
  };

  // --- Calculations for Admin Dashboard Metrics ---
  const adminMetrics = useMemo(() => {
    // Current local date simulated is 2026-05-21 (late May 2026)
    // Daily: sum of May 21
    const todayStr = "2026-05-21";
    const reportsToday = dailyReports.filter(r => r.date === todayStr);
    const dailyImps = reportsToday.reduce((sum, r) => sum + r.impressions, 0);
    const dailyRevUSD = reportsToday.reduce((sum, r) => sum + r.rawEarnings, 0);
    const dailyPubShareUSD = reportsToday.reduce((sum, r) => sum + r.publisherShare, 0);

    // Monthly: sum of whole May 2026 reports
    const reportsMonth = dailyReports.filter(r => r.date.startsWith("2026-05"));
    const monthlyImps = reportsMonth.reduce((sum, r) => sum + r.impressions, 0);
    const monthlyRevUSD = reportsMonth.reduce((sum, r) => sum + r.rawEarnings, 0);
    const monthlyPubShareUSD = reportsMonth.reduce((sum, r) => sum + r.publisherShare, 0);

    // Paid Out Total
    const totalPaidUSD = payouts
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    // Accumulated total earnings allocated to publishers
    const cumulativePubShareUSD = dailyReports.reduce((sum, r) => sum + r.publisherShare, 0);
    
    // Outstanding pending balance = cumulative share minus cumulative paid out
    const totalPendingUSD = Math.max(0, cumulativePubShareUSD - totalPaidUSD);

    // Admin actual profit commission = cumulative raw company revenue minus cumulative publisher share
    const totalRawAdsterraRevenue = dailyReports.reduce((sum, r) => sum + r.rawEarnings, 0);
    const adminCommissionUSD = Math.max(0, totalRawAdsterraRevenue - cumulativePubShareUSD);

    return {
      dailyImps,
      dailyRevUSD,
      dailyPubShareUSD,
      monthlyImps,
      monthlyRevUSD,
      monthlyPubShareUSD,
      totalPaidUSD,
      totalPendingUSD,
      adminCommissionUSD
    };
  }, [dailyReports, payouts]);

  // --- Calculations for SIMULATED Publisher Metrics ---
  const activePublisher = useMemo(() => {
    return publishers.find(p => p.id === simulatedPubId) || publishers[0];
  }, [publishers, simulatedPubId]);

  const publisherMetrics = useMemo(() => {
    if (!activePublisher) return { dailyImps: 0, dailyEarn: 0, monthlyImps: 0, monthlyEarn: 0, paidOut: 0, pending: 0 };

    const todayStr = "2026-05-21";
    
    // Daily filtered
    const pubTodayReports = dailyReports.filter(r => r.publisherId === activePublisher.id && r.date === todayStr);
    const dailyImps = pubTodayReports.reduce((sum, r) => sum + r.impressions, 0);
    const dailyEarn = pubTodayReports.reduce((sum, r) => sum + r.publisherShare, 0);

    // Monthly May 2026 filtered
    const pubMonthReports = dailyReports.filter(r => r.publisherId === activePublisher.id && r.date.startsWith("2026-05"));
    const monthlyImps = pubMonthReports.reduce((sum, r) => sum + r.impressions, 0);
    const monthlyEarn = pubMonthReports.reduce((sum, r) => sum + r.publisherShare, 0);

    // Cumulative overall
    const totalEarnedShare = dailyReports
      .filter(r => r.publisherId === activePublisher.id)
      .reduce((sum, r) => sum + r.publisherShare, 0);

    const paidOut = payouts
      .filter(p => p.publisherId === activePublisher.id && p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const pending = Math.max(0, totalEarnedShare - paidOut);

    return {
      dailyImps,
      dailyEarn,
      monthlyImps,
      monthlyEarn,
      paidOut,
      pending
    };
  }, [activePublisher, dailyReports, payouts]);

  // Handle actions passed down to subcomponents
  const handleAddPublisher = (newPub: Publisher) => {
    setPublishers(prev => [...prev, newPub]);
  };

  const handleTogglePublisherStatus = (id: string) => {
    setPublishers(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
  };

  const handleAddSmartLink = (newLink: SmartLink) => {
    setSmartLinks(prev => [...prev, newLink]);
  };

  const handleDeleteSmartLink = (id: string) => {
    setSmartLinks(prev => prev.filter(l => l.id !== id));
  };

  const handleAddReport = (newReport: DailyReport) => {
    setDailyReports(prev => [...prev, newReport]);
  };

  const handleApproveReport = (id: string) => {
    setDailyReports(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleDisbursePayout = (newPayout: PaymentPayout) => {
    setPayouts(prev => [...prev, newPayout]);

    // Automatically mark associated approved reports for this publisher as 'paid' to balance books
    setDailyReports(prev => prev.map(r => 
      r.publisherId === newPayout.publisherId && r.status === 'approved' 
        ? { ...r, status: 'paid' } 
        : r
    ));
  };

  // Simulated link copy feedback
  const [copiedSimLink, setCopiedSimLink] = useState<string | null>(null);

  // Custom historical chart rendering variables (last 7 days of raw revenue)
  const chartPoints = useMemo(() => {
    const dates = ["2026-05-15", "2026-05-16", "2026-05-17", "2026-05-18", "2026-05-19", "2026-05-20", "2026-05-21"];
    return dates.map(d => {
      // Sum raw Adsterra revenue & publisher share for this date
      const rpts = dailyReports.filter(r => r.date === d);
      const totalRaw = rpts.reduce((sum, r) => sum + r.rawEarnings, 0);
      const totalPub = rpts.reduce((sum, r) => sum + r.publisherShare, 0);
      return {
        label: d.split("-")[2], // show only day "15", "16" ...
        raw: totalRaw,
        pub: totalPub
      };
    });
  }, [dailyReports]);

  // Max value for scaling visual chart bars
  const maxChartVal = useMemo(() => {
    const vals = chartPoints.map(p => Math.max(p.raw, p.pub));
    return Math.max(...vals, 1);
  }, [chartPoints]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 overflow-x-hidden font-sans">
      
      {/* Top Banner (Header) */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-40 transition-all duration-300" id="main-header">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-indigo-500 rounded-xl flex items-center justify-center text-neutral-950 font-black tracking-tighter text-lg shadow-lg shadow-emerald-500/10">
              AD
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wide flex items-center gap-1.5 uppercase">
                Adsterra Hub
                <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {isUrdu ? "پبلیشرز پینل" : "Network Manager"}
                </span>
              </h1>
              <p className="text-[10px] text-neutral-400" style={{ fontFamily: isUrdu ? 'Jameel Noori Nastaleeq, system-ui' : 'inherit' }}>
                {isUrdu ? "اسمارٹ لنکس اور آٹومیٹک پے آؤٹ سسٹم" : "Smart Links Distribution & Automatic Payout Calculator"}
              </p>
            </div>
          </div>

          {/* Controls: Language and Role switcher */}
          <div className="flex items-center gap-4">
            
            {/* Bilingual translation component */}
            <LanguageSelector language={language} setLanguage={setLanguage} />

            {/* Quick reset data button */}
            <button
              onClick={handleResetData}
              title="Reset Database to seed data"
              className="p-2 border border-neutral-800 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white cursor-pointer hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Quick Role Swapper Nav Rail */}
      <section className="bg-neutral-900/35 border-b border-neutral-800/80 p-4" id="role-swapper-bar">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3" dir={isUrdu ? 'rtl' : 'ltr'}>
            <span className="text-xs font-semibold text-neutral-400">{t('currentRole')}</span>
            <div className="inline-flex bg-neutral-950 p-1 rounded-xl border border-neutral-850">
              <button
                id="btn-role-admin"
                onClick={() => setCurrentRole('admin')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  currentRole === 'admin'
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t('adminMode')}
              </button>
              <button
                id="btn-role-publisher"
                onClick={() => setCurrentRole('publisher')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  currentRole === 'publisher'
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t('publisherMode')}
              </button>
            </div>
          </div>

          {/* Simulated publisher dropdown switch (Only when publisher role is selected) */}
          {currentRole === 'publisher' && (
            <div className="flex items-center gap-2" dir={isUrdu ? 'rtl' : 'ltr'}>
              <span className="text-xs text-neutral-400 font-sans">{t('selectPublisherToView')}</span>
              <select
                id="app-pub-sim-selector"
                value={simulatedPubId}
                onChange={(e) => setSimulatedPubId(e.target.value)}
                className="bg-neutral-950 text-neutral-100 text-xs px-3 py-2 rounded-xl border border-neutral-800 focus:outline-none focus:border-emerald-500"
              >
                {publishers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Main Body Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* --- ROLE 1: ADMIN WORKSPACE DASHBOARD --- */}
        {currentRole === 'admin' && (
          <div className="space-y-8" id="admin-workspace-grid">
            
            {/* Admin sub-menu navigator buttons */}
            <div className="flex flex-wrap gap-2 pb-1 border-b border-neutral-800" dir={isUrdu ? 'rtl' : 'ltr'}>
              {[
                { id: 'overview', label: t('adminDashboard'), icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'publishers', label: t('publishers'), icon: <Users className="w-4 h-4" /> },
                { id: 'links', label: t('smartLinks'), icon: <Link2 className="w-4 h-4" /> },
                { id: 'reports', label: t('dailyReports'), icon: <Calendar className="w-4 h-4" /> },
                { id: 'calculator', label: t('payoutCalculator'), icon: <Coins className="w-4 h-4" /> },
                { id: 'history', label: t('paymentHistory'), icon: <History className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`admin-tab-btn-${tab.id}`}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer flex items-center gap-2 border transition-all duration-300 ${
                    adminTab === tab.id
                      ? 'bg-emerald-500 border-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/10'
                      : 'bg-neutral-900/40 border-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800/30'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Admin Render Tab Conditions */}
            {adminTab === 'overview' && (
              <div className="space-y-6">
                {/* Admin Statistic metrics widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="admin-stats-grid">
                  <StatCard
                    id="admin-stat-daily-rev"
                    title={t('dailyEarnings')}
                    value={`$${adminMetrics.dailyRevUSD.toFixed(2)}`}
                    subValue={isUrdu ? `ٹیم شیئر: $${adminMetrics.dailyPubShareUSD.toFixed(2)}` : `Team share: $${adminMetrics.dailyPubShareUSD.toFixed(2)}`}
                    icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
                    theme="emerald"
                    isUrdu={isUrdu}
                  />
                  <StatCard
                    id="admin-stat-monthly-rev"
                    title={t('monthlyEarnings')}
                    value={`$${adminMetrics.monthlyRevUSD.toFixed(2)}`}
                    subValue={isUrdu ? `ٹیم شیئر: $${adminMetrics.monthlyPubShareUSD.toFixed(2)}` : `Total Team: $${adminMetrics.monthlyPubShareUSD.toFixed(2)}`}
                    icon={<Award className="w-5 h-5 text-cyan-400" />}
                    theme="cyan"
                    isUrdu={isUrdu}
                  />
                  <StatCard
                    id="admin-stat-pending"
                    title={t('pendingPayout')}
                    value={`$${adminMetrics.totalPendingUSD.toFixed(2)}`}
                    subValue={isUrdu ? `تخمینہ: Rs. ${(Math.round(adminMetrics.totalPendingUSD * 280)).toLocaleString()}` : `Est conversion: Rs. ${(Math.round(adminMetrics.totalPendingUSD * 280)).toLocaleString()}`}
                    icon={<Wallet className="w-5 h-5 text-amber-400" />}
                    theme="amber"
                    isUrdu={isUrdu}
                  />
                  <StatCard
                    id="admin-stat-net-admin"
                    title={t('adminEarnings')}
                    value={`$${adminMetrics.adminCommissionUSD.toFixed(2)}`}
                    subValue={isUrdu ? `ایڈمن کا خالص منافع` : "Admin retained net profit"}
                    icon={<ShieldCheck className="w-5 h-5 text-indigo-400" />}
                    theme="indigo"
                    isUrdu={isUrdu}
                  />
                </div>

                {/* Impressions overview + graphical chart panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Custom interactive statistics trend report graph */}
                  <div className="lg:col-span-2 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-neutral-200">{t('latestDailyEarningHistory')}</h4>
                        <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">May 2026 week 3</span>
                      </div>
                      <p className="text-xs text-neutral-400 mb-6 font-sans">
                        {isUrdu 
                          ? "گزشتہ ایک ہفتے کی روزانہ کی کمائی کا تقابل (ایڈ کمپنی آمدنی بمقابلہ پبلیشر شیئر)" 
                          : "Earnings trend comparing raw brand earnings received from Adsterra vs pay shared with publisher team"}
                      </p>
                    </div>

                    {/* SVG/CSS graph bars */}
                    <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-1 border-b border-neutral-800 font-mono">
                      {chartPoints.map((pt, i) => {
                        const rawPct = (pt.raw / maxChartVal) * 100;
                        const pubPct = (pt.pub / maxChartVal) * 100;

                        return (
                          <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            {/* Hover tooltip */}
                            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 bg-neutral-950 border border-neutral-800 p-2 rounded-lg text-[9px] z-10 transition-opacity pointer-events-none w-24 text-center">
                              <p className="text-neutral-400">{isUrdu ? "کل" : "Raw"}: ${pt.raw.toFixed(1)}</p>
                              <p className="text-emerald-400">{isUrdu ? "پبلیشر" : "Pub"}: ${pt.pub.toFixed(1)}</p>
                            </div>

                            {/* Double Bars */}
                            <div className="w-full h-full flex items-end justify-center gap-1">
                              {/* Raw brand revenue bar (Cyan) */}
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${rawPct}%` }}
                                className="w-3 md:w-4 bg-cyan-500/25 border-t border-cyan-400 rounded-t-sm"
                                transition={{ duration: 0.8, delay: i * 0.05 }}
                              />
                              {/* Publisher yield share bar (Emerald) */}
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${pubPct}%` }}
                                className="w-3 md:w-4 bg-emerald-500/80 border-t border-emerald-400 rounded-t-sm"
                                transition={{ duration: 0.8, delay: i * 0.05 + 0.1 }}
                              />
                            </div>
                            <span className="text-[9px] text-neutral-500 mt-2 font-semibold">May {pt.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend key indicators */}
                    <div className="flex gap-4 justify-center items-center mt-4 text-[10px] text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-cyan-500/30 border border-cyan-400 rounded-sm" />
                        <span>{isUrdu ? "ادارہ کل کمائی (کمپنی)" : "Total Recieved Brand"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                        <span>{isUrdu ? "ٹیم ممبرز حصہ ادائیگی" : "Publisher Share Disbursed"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Network Health Quick Check List */}
                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-200 border-b border-neutral-800 pb-3 flex items-center gap-2 font-sans">
                        <ShieldAlert className="w-4 h-4 text-emerald-400" />
                        {t('quickStats')}
                      </h4>
                      
                      <div className="space-y-4 mt-4 font-sans text-xs">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-neutral-400">{isUrdu ? "ٹوٹل فعال پبلیشرز:" : "Active Network Members:"}</span>
                          <span className="font-bold text-neutral-100">{publishers.filter(p => p.status === 'active').length} {isUrdu ? 'افراد' : 'Members'}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-neutral-400">{isUrdu ? "مجموعی اسمارٹ لنکس:" : "Smart Link Campaigns:"}</span>
                          <span className="font-bold text-neutral-100">{smartLinks.length} {isUrdu ? 'لنکس' : 'Links'}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-neutral-400">{isUrdu ? "مجموعی امپریشنز (مہینہ):" : "Total Traffic Impressions:"}</span>
                          <span className="font-bold font-mono text-emerald-400">{adminMetrics.monthlyImps.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-neutral-400">{isUrdu ? "تقسیم شدہ رقم (USDT/پیسہ):" : "Disbursed Funds Balance:"}</span>
                          <span className="font-bold font-mono text-amber-500">${adminMetrics.totalPaidUSD.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-500/5 border border-emerald-900 rounded-2xl text-[11px] leading-relaxed text-neutral-400">
                      💡 <strong>{isUrdu ? "لاگ ان ایڈ منسٹریٹر نوٹ:" : "Administrator Helper:"}</strong> {isUrdu ? "جب بھی پبلیشر کے لنک پر کلک ہوتے ہیں تو Adsterra ڈیش بورڈ میں امپریشنز جمع ہوتے ہیں۔ آپ روزانہ کے اینڈ پر ہر ممبر کا والیم 'روزانہ کا حساب' میں آ کر لکھ لیا کریں، جس سے پے آؤٹ خود بخود تیار ہو جائے گا۔" : "Log daily reports for each member. The program's engine will instantly run audit formulas to prepare payout details."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'publishers' && (
              <PublishersManager
                publishers={publishers}
                onAddPublisher={handleAddPublisher}
                onTogglePublisherStatus={handleTogglePublisherStatus}
                language={language}
              />
            )}

            {adminTab === 'links' && (
              <SmartLinksManager
                smartLinks={smartLinks}
                publishers={publishers}
                onAddSmartLink={handleAddSmartLink}
                onDeleteSmartLink={handleDeleteSmartLink}
                language={language}
              />
            )}

            {adminTab === 'reports' && (
              <DailyReportsManager
                dailyReports={dailyReports}
                publishers={publishers}
                smartLinks={smartLinks}
                onAddReport={handleAddReport}
                onApproveReport={handleApproveReport}
                language={language}
              />
            )}

            {adminTab === 'calculator' && (
              <AutomaticPayoutCalculator
                publishers={publishers}
                dailyReports={dailyReports}
                payouts={payouts}
                onDisbursePayout={handleDisbursePayout}
                language={language}
              />
            )}

            {adminTab === 'history' && (
              <PaymentHistoryManager
                payouts={payouts}
                publishers={publishers}
                language={language}
              />
            )}
          </div>
        )}

        {/* --- ROLE 2: SIMULATED PUBLISHER VIEW (TEAM MEMBER WORKSPACE) --- */}
        {currentRole === 'publisher' && (
          <div className="space-y-8 animate-fade-in" id="publisher-workspace">
            {/* Introductory sandbox message */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <UserCheck className="w-5 h-5 shrink-0" />
                  {isUrdu ? `${activePublisher?.name || 'پبلیشر'} کا کام ڈیش بورڈ` : `Publisher Personal View: ${activePublisher?.name || 'Publisher'}`}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {t('trackEarningsDesc')}
                </p>
              </div>
              <div className="bg-amber-500/10 text-amber-500 text-[10px] font-mono tracking-wide px-3 py-1 rounded-full border border-amber-500/20 uppercase">
                {isUrdu ? `آپ کا مقررہ ریٹ: ${activePublisher?.payoutRate || 80}%` : `Your Share Policy: ${activePublisher?.payoutRate || 80}%`}
              </div>
            </div>

            {/* Individual Publisher Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="publisher-stats-grid">
              <StatCard
                id="pub-stat-daily-rev"
                title={t('dailyEarnings')}
                value={`$${publisherMetrics.dailyEarn.toFixed(2)}`}
                subValue={isUrdu ? `تخمینہ: Rs. ${(Math.round(publisherMetrics.dailyEarn * 280)).toLocaleString()}` : `Est conversion: Rs. ${(Math.round(publisherMetrics.dailyEarn * 280)).toLocaleString()}`}
                icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
                theme="emerald"
                isUrdu={isUrdu}
              />
              <StatCard
                id="pub-stat-daily-imps"
                title={t('dailyImpressions')}
                value={publisherMetrics.dailyImps.toLocaleString()}
                subValue={isUrdu ? "آج کے کل امپریشنز" : "Impressions logged today"}
                icon={<ArrowUpRight className="w-5 h-5 text-cyan-400" />}
                theme="cyan"
                isUrdu={isUrdu}
              />
              <StatCard
                id="pub-stat-monthly-rev"
                title={t('monthlyEarnings')}
                value={`$${publisherMetrics.monthlyEarn.toFixed(2)}`}
                subValue={isUrdu ? `تخمینہ: Rs. ${(Math.round(publisherMetrics.monthlyEarn * 280)).toLocaleString()}` : `Whole month sum`}
                icon={<Award className="w-5 h-5 text-indigo-400" />}
                theme="indigo"
                isUrdu={isUrdu}
              />
              <StatCard
                id="pub-stat-pending"
                title={t('pendingPayout')}
                value={`$${publisherMetrics.pending.toFixed(2)}`}
                subValue={isUrdu ? "بقایا ادائیگی" : "Yet to disburse"}
                icon={<Wallet className="w-5 h-5 text-amber-400" />}
                theme="amber"
                isUrdu={isUrdu}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Assigned Smart Links Table */}
              <div className="lg:col-span-8 bg-neutral-900/40 rounded-3xl border border-neutral-800 p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-200 border-b border-neutral-850 pb-3 mb-4 flex items-center gap-2 font-sans">
                    <Link2 className="w-4 h-4 text-indigo-400" />
                    {t('distributedLinksTracker')}
                  </h4>

                  <p className="text-xs text-neutral-400 mb-6 font-sans">
                    {isUrdu 
                      ? "یہ وہ لنکس ہیں جو ایڈمن نے آپ کو کام کے لیے تفویض کیے ہیں۔ ان لنکس کو کاپی کر کے اپنی وال پر، فیس بک گروپس یا ویب سائٹ ٹریفک میں شیئر کریں:" 
                      : "These are your assigned ad campaign URLs. Copy these tracking endpoints to direct your social or site traffic:"}
                  </p>

                  <div className="space-y-4">
                    {smartLinks.filter(l => l.assignedPublisherId === simulatedPubId).length === 0 ? (
                      <p className="text-center py-6 text-neutral-500 text-xs">{t('noData')}</p>
                    ) : (
                      smartLinks.filter(l => l.assignedPublisherId === simulatedPubId).map((link) => {
                        const trackingUrl = `${link.originalUrl}${link.originalUrl.includes('?') ? '&' : '?'}subid=${activePublisher.name.replace(/\s+/g, '')}`;

                        return (
                          <div key={link.id} className="bg-neutral-950/50 p-4 rounded-2xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold text-neutral-200">{link.name}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-950 px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono">{link.sourceCompany}</span>
                                <span className="text-[10px] text-neutral-500 font-mono break-all">{trackingUrl}</span>
                              </div>
                            </div>
                            
                            <button
                              id={`pub-copy-btn-${link.id}`}
                              onClick={() => {
                                navigator.clipboard.writeText(trackingUrl);
                                setCopiedSimLink(link.id);
                                setTimeout(() => setCopiedSimLink(null), 2000);
                              }}
                              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors ${
                                copiedSimLink === link.id
                                  ? 'bg-emerald-500 text-neutral-950'
                                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
                              }`}
                            >
                              {copiedSimLink === link.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  {t('copied')}
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  {t('copyLink')}
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-850 flex items-center justify-between gap-2 text-xs text-neutral-500">
                  <span>{isUrdu ? "ٹپ: روزانہ کی کمائی اپڈیٹ دیکھنے کے لیے پیج ہلا سکتے ہیں۔" : "Last updated statistics sync ready."}</span>
                  <HelpCircle className="w-4 h-4 text-neutral-600" />
                </div>
              </div>

              {/* Right Column: Personal ledger stats & Payment details verification widget */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Simulated direct request support */}
                <div className="bg-neutral-900/40 rounded-3xl border border-neutral-800 p-6 space-y-4">
                  <h4 className="text-sm font-bold text-neutral-200 border-b border-neutral-850 pb-3 flex items-center gap-2 font-sans">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    {isUrdu ? "رقم واپسی اور اکاؤنٹ" : "Payout & Wallet Status"}
                  </h4>

                  <div className="space-y-3 font-sans text-xs">
                    <div>
                      <span className="text-neutral-400 block mb-1">{isUrdu ? "آپ کا والٹ / طریقہ کار:" : "Your registered Payout Address:"}</span>
                      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                        <p className="font-bold text-emerald-400">{activePublisher?.paymentMethod}</p>
                        <p className="font-mono mt-1 text-neutral-300 break-all">{activePublisher?.paymentDetails}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-neutral-400 block mb-1">{isUrdu ? "کل وصول کردہ (پاکستانی روپے):" : "Cumulative Paid Out:"}</span>
                      <p className="text-lg font-black text-neutral-100 font-mono">Rs. {(Math.round(publisherMetrics.paidOut * 280)).toLocaleString()}/-</p>
                    </div>

                    <button
                      id="btn-trigger-payout-call"
                      onClick={() => {
                        if (publisherMetrics.pending <= 0) {
                          alert(isUrdu ? "آپ کا کوئی بقایا بیلنس نہیں ہے۔" : "You have no outstanding balance to request!");
                          return;
                        }
                        alert(isUrdu 
                          ? `رقم واپسی کی درخواست بھیج دی گئی ہے! ایڈمن آپ کے ${activePublisher?.paymentMethod} والٹ میں جلد رقم منتقل کر کے رسید اپلوڈ کر دے گا۔` 
                          : `Request submitted! Admin will evaluate and pay $${publisherMetrics.pending.toFixed(2)} to your preferred wallet soon.`);
                      }}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm mt-3"
                    >
                      <ArrowDownCircle className="w-4 h-4" />
                      {isUrdu ? "پے آؤٹ کی درخواست کریں" : "Request Payout Disbursment"}
                    </button>
                  </div>
                </div>

                {/* Simulated performance badge badge */}
                <div className="bg-gradient-to-br from-indigo-950/25 to-purple-950/25 border border-indigo-900/60 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-widest">{isUrdu ? "نیٹ ورک رینکنگ" : "Network Ranking"}</span>
                  <div className="inline-flex p-3 bg-indigo-500/10 text-indigo-400 rounded-full">
                    <Award className="w-8 h-8" />
                  </div>
                  <h5 className="text-sm font-bold text-neutral-100">{isUrdu ? "پریمیم پبلیشر کلب" : "VIP Traffic Producer"}</h5>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                    {isUrdu 
                      ? "آپ کی ٹریفک مکس اور باؤنس ریٹ کی بنیاد پر ایڈمن کی طرف سے آپ کو پریمیم پے آؤٹ ریٹ مل رہا ہے!" 
                      : "Based on your premium click volume and bounce ratios, you are locked into our top tier. Keep generating high volume and CPM!"}
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      {/* Decorative footer stamp */}
      <footer className="border-t border-neutral-900 mt-16 bg-neutral-950/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Adsterra Publisher Network Tracker. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span className="font-mono">UTC: 2026-05-21 22:20</span>
            <span className="text-emerald-500 flex items-center gap-1">● {isUrdu ? "سسٹم آن لائن" : "Network Live"}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
