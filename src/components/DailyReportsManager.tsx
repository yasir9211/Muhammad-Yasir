/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Plus, Eye, Check, Calendar, TrendingUp, Sparkles, Filter, RefreshCw, Layers } from 'lucide-react';
import { Publisher, SmartLink, DailyReport } from '../types';
import { translations } from '../data';

interface DailyReportsManagerProps {
  dailyReports: DailyReport[];
  publishers: Publisher[];
  smartLinks: SmartLink[];
  onAddReport: (newReport: DailyReport) => void;
  onApproveReport: (id: string) => void;
  language: 'en' | 'ur';
}

export function DailyReportsManager({
  dailyReports,
  publishers,
  smartLinks,
  onAddReport,
  onApproveReport,
  language
}: DailyReportsManagerProps) {
  const t = (key: string) => translations[key]?.[language] || key;
  const isUrdu = language === 'ur';

  // State
  const [showAddForm, setShowAddForm] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPubId, setSelectedPubId] = useState(publishers[0]?.id || '');
  const [selectedLinkId, setSelectedLinkId] = useState('');
  const [impressions, setImpressions] = useState('');
  const [rawEarnings, setRawEarnings] = useState('');

  // Filtering for reports table
  const [filterPubId, setFilterPubId] = useState<'all' | string>('all');

  // Filter links belonging ONLY to the selected publisher in the Add form
  const filteredLinksForSelectedPub = useMemo(() => {
    return smartLinks.filter(l => l.assignedPublisherId === selectedPubId);
  }, [smartLinks, selectedPubId]);

  // Handle first link selection when publisher changes in form
  useMemo(() => {
    if (filteredLinksForSelectedPub.length > 0) {
      setSelectedLinkId(filteredLinksForSelectedPub[0].id);
    } else {
      setSelectedLinkId('');
    }
  }, [filteredLinksForSelectedPub]);

  // Selected Publisher object for commission rate calculation preview
  const activePublisherObj = useMemo(() => {
    return publishers.find(p => p.id === selectedPubId);
  }, [publishers, selectedPubId]);

  // Dynamic preview calculations for the entry form
  const previewPublisherShare = useMemo(() => {
    const rawVal = parseFloat(rawEarnings) || 0;
    const rate = activePublisherObj?.payoutRate || 75;
    return rawVal * (rate / 100);
  }, [rawEarnings, activePublisherObj]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const impValue = parseInt(impressions);
    const earnValue = parseFloat(rawEarnings);

    if (isNaN(impValue) || impValue <= 0 || isNaN(earnValue) || earnValue < 0) {
      alert("Please enter valid credentials.");
      return;
    }

    if (!selectedLinkId) {
      alert(isUrdu ? "ادائیگی کا کوئی سمارٹ لنک منتخب کریں۔ پہلے لنکس مینیجر میں لنک بنائیں۔" : "Please allocate or assign a smart link first.");
      return;
    }

    const rate = activePublisherObj?.payoutRate || 75;
    const calculatedPubShare = earnValue * (rate / 100);

    const newReport: DailyReport = {
      id: "rep_" + Date.now(),
      date,
      publisherId: selectedPubId,
      linkId: selectedLinkId,
      impressions: impValue,
      rawEarnings: earnValue,
      publisherShare: Number(calculatedPubShare.toFixed(2)),
      status: 'pending' // starts as pending approval
    };

    onAddReport(newReport);

    // Reset Form fields
    setImpressions('');
    setRawEarnings('');
    setShowAddForm(false);
  };

  // Filtered reports to show in the table
  const displayReports = useMemo(() => {
    const sorted = [...dailyReports].sort((a, b) => b.date.localeCompare(a.date));
    if (filterPubId === 'all') return sorted;
    return sorted.filter(r => r.publisherId === filterPubId);
  }, [dailyReports, filterPubId]);

  // Total summary of the displayed reports
  const totals = useMemo(() => {
    let imps = 0;
    let earnUSD = 0;
    let shareUSD = 0;
    displayReports.forEach(r => {
      imps += r.impressions;
      earnUSD += r.rawEarnings;
      shareUSD += r.publisherShare;
    });
    return { imps, earnUSD, shareUSD };
  }, [displayReports]);

  return (
    <div className="bg-neutral-900/40 rounded-3xl border border-neutral-800 p-6 backdrop-blur-md" id="daily-reports-section" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-50 tracking-wide font-sans">{t('dailyReports')}</h2>
            <p className="text-neutral-400 text-xs mt-1">
              {isUrdu 
                ? "روزانہ کے امپریشنز اور ایڈ ریونیو کا اندراج کریں" 
                : "Record daily traffic, impressions, and company payout allocations per publisher"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 bg-neutral-950/60 p-1.5 rounded-xl border border-neutral-800">
            <Filter className="w-3.5 h-3.5 text-neutral-400 ml-1" />
            <select
              value={filterPubId}
              onChange={(e) => setFilterPubId(e.target.value)}
              className="bg-transparent text-neutral-300 text-xs border-none focus:outline-none cursor-pointer pr-4"
            >
              <option value="all">{isUrdu ? "تمام ممبرز" : "All Members"}</option>
              {publishers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <button
            id="btn-toggle-add-report"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? t('cancel') : t('addDailyReport')}
          </button>
        </div>
      </div>

      {/* Record/Add Daily Report form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-neutral-950/40 border border-neutral-800/80 p-5 rounded-2xl mb-6 space-y-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs uppercase tracking-wider text-cyan-400 font-bold font-sans">
                {isUrdu ? "نیا حساب کتاب درج فارم" : "New Traffic Ledger Entry"}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date selection */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('date')}</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Publisher selection */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('publisherName')}</label>
                <select
                  value={selectedPubId}
                  onChange={(e) => setSelectedPubId(e.target.value)}
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-cyan-400 font-sans"
                >
                  {publishers.map((pub) => (
                    <option key={pub.id} value={pub.id}>
                      {pub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SmartLink filtered selection */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('smartLinks')}</label>
                {filteredLinksForSelectedPub.length === 0 ? (
                  <div className="text-xs text-rose-400 bg-rose-500/5 p-2 rounded-lg border border-rose-950">
                    ⚠️ {isUrdu ? "اس پبلیشر کا کوئی لنک نہیں ہے!" : "No link assigned to this publisher!"}
                  </div>
                ) : (
                  <select
                    value={selectedLinkId}
                    onChange={(e) => setSelectedLinkId(e.target.value)}
                    className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-cyan-400 font-sans"
                  >
                    {filteredLinksForSelectedPub.map((link) => (
                      <option key={link.id} value={link.id}>
                        {link.name} ({link.sourceCompany})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Impressions count */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('impressionsCount')}</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={impressions}
                  onChange={(e) => setImpressions(e.target.value)}
                  placeholder="e.g., 25000"
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Raw Earnings from Ad Company */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('totalRevenueUSD')}</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  value={rawEarnings}
                  onChange={(e) => setRawEarnings(e.target.value)}
                  placeholder="e.g., 75.50"
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Dynamic visual preview of publisher share */}
            {activePublisherObj && (
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between">
                <div className="text-xs text-neutral-400 font-sans">
                  {isUrdu 
                    ? `کمیشن شیئر فارمولا: ${activePublisherObj.payoutRate}% پبلیشر اور ${100 - activePublisherObj.payoutRate}% ایڈمن` 
                    : `Commission Split: ${activePublisherObj.payoutRate}% Publisher / ${100 - activePublisherObj.payoutRate}% Admin`}
                </div>
                <div className="text-xs font-mono font-bold text-neutral-100">
                  {isUrdu ? "پبلیشر کا حصہ رقم:" : "Calculated Publisher Share:"}{' '}
                  <span className="text-cyan-400 text-sm font-black">${previewPublisherShare.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-bold text-xs py-2 px-4 rounded-lg cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={filteredLinksForSelectedPub.length === 0}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-neutral-950 font-bold text-xs py-2 px-4 rounded-lg cursor-pointer"
              >
                {t('save')}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reports Summary Bar */}
      <div className="grid grid-cols-3 gap-3 mb-4 bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/80 font-mono">
        <div className="text-center">
          <span className="text-[10px] text-neutral-400 block">{isUrdu ? "مجموعی امپریشنز" : "Select Total Imps"}</span>
          <span className="text-xs md:text-sm text-cyan-400 font-extrabold">{totals.imps.toLocaleString()}</span>
        </div>
        <div className="text-center border-x border-neutral-850">
          <span className="text-[10px] text-neutral-400 block">{isUrdu ? "کل آمدنی (ایڈ کمپنی)" : "Select Total Raw"}</span>
          <span className="text-xs md:text-sm text-neutral-100 font-extrabold">${totals.earnUSD.toFixed(2)}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-neutral-400 block">{isUrdu ? "پبلیشرز نیٹ شیئر" : "Select Pub Share"}</span>
          <span className="text-xs md:text-sm text-emerald-400 font-extrabold">${totals.shareUSD.toFixed(2)}</span>
        </div>
      </div>

      {/* Reports Table list */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-neutral-950/60 border-b border-neutral-800 text-[10px] text-neutral-400 uppercase tracking-widest">
              <th className="p-4 text-left">{t('date')}</th>
              <th className="p-4 text-center">{t('publisherName')}</th>
              <th className="p-4 text-center">{t('smartLinks')}</th>
              <th className="p-4 text-right">{t('impressionsCount')}</th>
              <th className="p-4 text-right">{isUrdu ? "کمپنی ارننگ ($)" : "Company Earn ($)"}</th>
              <th className="p-4 text-right text-emerald-400">{isUrdu ? "پبلیشر حصہ ($)" : "Pub Share ($)"}</th>
              <th className="p-4 text-center">{t('status')}</th>
              <th className="p-4 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-xs">
            {displayReports.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-neutral-500">{t('noData')}</td>
              </tr>
            ) : (
              displayReports.map((report) => {
                const pubName = publishers.find(p => p.id === report.publisherId)?.name || 'Unknown';
                const linkName = smartLinks.find(l => l.id === report.linkId)?.name || 'Deleted Link';

                return (
                  <tr key={report.id} className="hover:bg-neutral-900/20 text-neutral-200">
                    {/* Date */}
                    <td className="p-4 text-left font-mono font-medium text-neutral-300">{report.date}</td>
                    
                    {/* Publisher */}
                    <td className="p-4 text-center font-bold text-amber-500">{pubName}</td>

                    {/* Link */}
                    <td className="p-4 text-center text-neutral-300 max-w-[120px] truncate">{linkName}</td>

                    {/* Impressions */}
                    <td className="p-4 text-right font-mono font-semibold">{report.impressions.toLocaleString()}</td>

                    {/* Co. income */}
                    <td className="p-4 text-right font-mono">${report.rawEarnings.toFixed(2)}</td>

                    {/* Pub share */}
                    <td className="p-4 text-right font-bold font-mono text-emerald-400">${report.publisherShare.toFixed(2)}</td>

                    {/* Status badge */}
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                        report.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : report.status === 'approved'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {report.status === 'paid' ? t('paid') : report.status === 'approved' ? (isUrdu ? 'منظور شدہ' : 'Approved') : t('pending')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      {report.status === 'pending' ? (
                        <button
                          title="Approve report values & update general ledger"
                          onClick={() => onApproveReport(report.id)}
                          className="bg-cyan-500 hover:bg-cyan-400 text-neutral-950 px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer flex items-center gap-1 mx-auto transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          {t('approve')}
                        </button>
                      ) : (
                        <span className="text-neutral-500 font-medium text-[10px]">--</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
