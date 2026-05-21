/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Landmark, Coins, FileText, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Publisher, DailyReport, PaymentPayout } from '../types';
import { translations } from '../data';

interface AutomaticPayoutCalculatorProps {
  publishers: Publisher[];
  dailyReports: DailyReport[];
  payouts: PaymentPayout[];
  onDisbursePayout: (newPayout: PaymentPayout) => void;
  language: 'en' | 'ur';
}

export function AutomaticPayoutCalculator({
  publishers,
  dailyReports,
  payouts,
  onDisbursePayout,
  language
}: AutomaticPayoutCalculatorProps) {
  const t = (key: string) => translations[key]?.[language] || key;
  const isUrdu = language === 'ur';

  // State
  const [selectedPubId, setSelectedPubId] = useState<string>(publishers[0]?.id || '');
  const [payoutAmountUSD, setPayoutAmountUSD] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number>(280);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Selected Publisher object
  const selectedPub = useMemo(() => {
    return publishers.find(p => p.id === selectedPubId);
  }, [publishers, selectedPubId]);

  // Set default payment method and details when publisher selection changes
  useMemo(() => {
    if (selectedPub) {
      setPaymentMethod(selectedPub.paymentMethod);
      setPaymentDetails(selectedPub.paymentDetails);
      // Determine pending balance for this publisher
      const totalEarned = dailyReports
        .filter(r => r.publisherId === selectedPub.id)
        .reduce((sum, r) => sum + r.publisherShare, 0);

      const totalPaid = payouts
        .filter(p => p.publisherId === selectedPub.id && p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);

      const pending = Math.max(0, totalEarned - totalPaid);
      setPayoutAmountUSD(pending.toFixed(2));
      setNotes(`Payment disburser for ${selectedPub.name}`);
    }
  }, [selectedPub, dailyReports, payouts]);

  // Calculations for current selected publisher
  const stats = useMemo(() => {
    if (!selectedPub) return { totalEarned: 0, totalPaid: 0, pending: 0 };

    const totalEarned = dailyReports
      .filter(r => r.publisherId === selectedPub.id)
      .reduce((sum, r) => sum + r.publisherShare, 0);

    const totalPaid = payouts
      .filter(p => p.publisherId === selectedPub.id && p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const pending = totalEarned - totalPaid;

    return {
      totalEarned,
      totalPaid,
      pending: Math.max(0, pending)
    };
  }, [selectedPub, dailyReports, payouts]);

  const calculatedPKR = useMemo(() => {
    const amt = parseFloat(payoutAmountUSD) || 0;
    return Math.round(amt * exchangeRate);
  }, [payoutAmountUSD, exchangeRate]);

  const handleDisburse = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmountUSD);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid payout amount.");
      return;
    }

    const randomTxid = "TXID-" + Math.random().toString(36).substring(3, 11).toUpperCase();

    const newPayout: PaymentPayout = {
      id: "pay_" + Date.now(),
      publisherId: selectedPubId,
      amount: amount,
      amountPKR: calculatedPKR,
      date: new Date().toISOString().split('T')[0],
      method: paymentMethod,
      details: paymentDetails,
      status: 'paid',
      txid: randomTxid,
      notes: notes
    };

    onDisbursePayout(newPayout);
    setSuccessMsg(isUrdu 
      ? `شاندار! ${selectedPub?.name} کو ${amount.toFixed(2)}$ کی ادائیگی کامیابی کے ساتھ درج کر دی گئی ہے۔`
      : `Success! Paid $${amount.toFixed(2)} to ${selectedPub?.name} successfully.`);

    setTimeout(() => {
      setSuccessMsg(null);
    }, 5000);
  };

  return (
    <div className="bg-neutral-900/40 rounded-3xl border border-neutral-800 p-6 backdrop-blur-md" id="payout-calc-section" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-50 tracking-wide font-sans">{t('calcHeader')}</h2>
          <p className="text-neutral-400 text-xs mt-1">{t('payoutCalculatorDesc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Statistics and Quick Audit Sidebar */}
        <div className="lg:col-span-5 bg-neutral-950/40 p-5 rounded-2xl border border-neutral-800/60 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-3 font-sans">
              {isUrdu ? "پبلیشر کھاتہ آڈٹ" : "Publisher Ledger Audit"}
            </span>

            {/* Select Publisher dropdown */}
            <div className="mb-4">
              <label className="text-xs text-neutral-400 block mb-2 font-medium">{t('selectPublisher')}</label>
              <select
                id="calc-pub-selector"
                value={selectedPubId}
                onChange={(e) => setSelectedPubId(e.target.value)}
                className="w-full bg-neutral-900 text-neutral-200 text-sm px-4 py-3 rounded-xl border border-neutral-800 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {publishers.map((pub) => (
                  <option key={pub.id} value={pub.id}>
                    {pub.name} ({pub.payoutRate}%)
                  </option>
                ))}
              </select>
            </div>

            {selectedPub && (
              <div className="space-y-4 pt-2 border-t border-neutral-800/60 font-mono">
                <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-neutral-900/40">
                  <span className="text-neutral-400">{isUrdu ? "کل کمائی حصہ:" : "Total Earned Share:"}</span>
                  <span className="text-neutral-200 font-bold">${stats.totalEarned.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-neutral-900/40">
                  <span className="text-neutral-400">{isUrdu ? "سابقہ ادائیگی:" : "Total Paid Out:"}</span>
                  <span className="text-emerald-400 font-bold">${stats.totalPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-emerald-500/5 rounded-xl border border-emerald-950/60">
                  <span className="text-emerald-400 font-semibold">{isUrdu ? "باقی بقایا رقم (سسٹم آڈیٹڈ):" : "Pending Balance (Audited):"}</span>
                  <span className="text-emerald-400 text-base font-extrabold">${stats.pending.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {selectedPub && (
            <div className="mt-6 pt-4 border-t border-neutral-800/60 text-xs text-neutral-500 space-y-1">
              <span className="text-neutral-400 font-semibold block mb-1">{isUrdu ? "کارڈ کی تفصیلات:" : "Preferred Destination:"}</span>
              <p>📍 {isUrdu ? "طریقہ کار" : "Method"}: <span className="text-neutral-300 font-semibold">{selectedPub.paymentMethod}</span></p>
              <p>💳 {isUrdu ? "تفصیل" : "Details"}: <span className="text-neutral-300 break-all font-semibold">{selectedPub.paymentDetails}</span></p>
            </div>
          )}
        </div>

        {/* Calculation Form */}
        <form onSubmit={handleDisburse} className="lg:col-span-7 bg-neutral-950/20 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-2 border-b border-neutral-800 pb-3 font-sans">
            <Coins className="w-4 h-4 text-amber-400" />
            {isUrdu ? "پیمنٹ ڈسبورسمنٹ فارم" : "Payment Disbursement Form"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount input in USD */}
            <div>
              <label className="text-xs text-neutral-400 block mb-1 font-medium">{isUrdu ? "رقم برائے ادائیگی ($ USD):" : "Disburse Amount ($ USD):"}</label>
              <input
                id="calc-input-amount"
                type="number"
                step="0.01"
                required
                value={payoutAmountUSD}
                onChange={(e) => setPayoutAmountUSD(e.target.value)}
                className="w-full bg-neutral-900 text-neutral-50 text-sm px-4 py-3 rounded-xl border border-neutral-800 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Custom PK Rate converter */}
            <div>
              <label className="text-xs text-neutral-400 block mb-1 font-medium">{isUrdu ? "ایکسچینج ریٹ (1$ برابر پاکستانی روپے):" : "Exchange Rate (1 USD to PKR):"}</label>
              <input
                id="calc-input-rate"
                type="number"
                required
                value={exchangeRate}
                onChange={(e) => setExchangeRate(parseInt(e.target.value) || 0)}
                className="w-full bg-neutral-900 text-neutral-50 text-sm px-4 py-3 rounded-xl border border-neutral-800 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-sans font-bold block mb-1">{isUrdu ? "پبلیشر کا مجموعی حصہ:" : "Estimated Publisher Share"}</span>
              <p className="text-xl font-black text-emerald-400 font-mono">${(parseFloat(payoutAmountUSD) || 0).toFixed(2)}</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-sans font-bold block mb-1">{isUrdu ? "پاکستانی روپے میں ادائیگی تخمینہ:" : "Estimated PKR Payout"}</span>
              <p className="text-xl font-black text-amber-500 font-mono">Rs. {calculatedPKR.toLocaleString()}/-</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Destination Method override if custom */}
            <div>
              <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('paymentMethod')}</label>
              <input
                type="text"
                required
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-neutral-900 text-neutral-100 text-sm px-4 py-2 rounded-xl border border-neutral-800 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            {/* Details details */}
            <div>
              <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('paymentDetails')}</label>
              <input
                type="text"
                required
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                className="w-full bg-neutral-900 text-neutral-100 text-sm px-4 py-2 rounded-xl border border-neutral-800 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1 font-medium">{isUrdu ? "اضافی ریمارکس / نوٹس:" : "Additional Remarks / Notes:"}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Weekly earnings disburse"
              className="w-full bg-neutral-900 text-neutral-100 text-sm px-4 py-2 rounded-xl border border-neutral-800 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <button
            id="btn-disburse-payment"
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 font-sans"
          >
            <Landmark className="w-4 h-4" />
            {t('recordPayoutEntry')}
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
