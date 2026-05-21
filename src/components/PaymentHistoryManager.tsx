/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, FileSpreadsheet, Eye, Receipt, X, Printer, CheckCircle2, DollarSign, Calendar, Wallet } from 'lucide-react';
import { Publisher, PaymentPayout } from '../types';
import { translations } from '../data';

interface PaymentHistoryManagerProps {
  payouts: PaymentPayout[];
  publishers: Publisher[];
  language: 'en' | 'ur';
}

export function PaymentHistoryManager({
  payouts,
  publishers,
  language
}: PaymentHistoryManagerProps) {
  const t = (key: string) => translations[key]?.[language] || key;
  const isUrdu = language === 'ur';

  // State for Invoice modal overlay popup
  const [selectedPayout, setSelectedPayout] = useState<PaymentPayout | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-neutral-900/40 rounded-3xl border border-neutral-800 p-6 backdrop-blur-md" id="payment-history-section" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-50 tracking-wide font-sans">{t('paymentHistory')}</h2>
            <p className="text-neutral-400 text-xs mt-1">
              {isUrdu 
                ? "پبلیشرز کو بھیجی گئی رقوم اور رسیدوں کا ریکارڈ" 
                : "History of disbursed rewards, transactions status, and payment receipts list"}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            // Download CSV logic mock or simply alert
            const headers = "Date,Publisher,Amount USD,Amount PKR,Method,Wallet Details,Status,TXID\n";
            const rows = payouts.map(p => {
              const name = publishers.find(pub => pub.id === p.publisherId)?.name || 'Unknown';
              return `"${p.date}","${name}","${p.amount}","${p.amountPKR}","${p.method}","${p.details.replace(/"/g, '""')}","${p.status}","${p.txid || ''}"`;
            }).join("\n");
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Payout_Statement_History.csv";
            a.click();
          }}
          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors border border-neutral-700"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          {isUrdu ? "ایکسپورٹ ڈیٹا (CSV)" : "Export History (CSV)"}
        </button>
      </div>

      {/* Payout Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-neutral-950/60 border-b border-neutral-800 text-[10px] text-neutral-400 uppercase tracking-widest">
              <th className="p-4 text-left">{t('date')}</th>
              <th className="p-4 text-center">{t('publisherName')}</th>
              <th className="p-4 text-right">{isUrdu ? "رقم (ڈالر)" : "Amount (USD)"}</th>
              <th className="p-4 text-right">{isUrdu ? "رقم (روپے)" : "Amount (PKR)"}</th>
              <th className="p-4 text-center">{t('paymentMethod')}</th>
              <th className="p-4 text-right hidden md:table-cell">{isUrdu ? "ٹرانزیکشن والٹ تفصیل" : "Transaction Details"}</th>
              <th className="p-4 text-center">{t('status')}</th>
              <th className="p-4 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-xs">
            {payouts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-neutral-500">{t('noData')}</td>
              </tr>
            ) : (
              [...payouts].sort((a,b)=>b.date.localeCompare(a.date)).map((pay) => {
                const pub = publishers.find(p => p.id === pay.publisherId);
                const pubName = pub?.name || 'Unknown';

                return (
                  <tr key={pay.id} className="hover:bg-neutral-900/20 text-neutral-200">
                    <td className="p-4 text-left font-mono text-neutral-400">{pay.date}</td>
                    <td className="p-4 text-center font-bold text-amber-400">{pubName}</td>
                    <td className="p-4 text-right font-bold text-neutral-100 font-mono">${pay.amount.toFixed(2)}</td>
                    <td className="p-4 text-right font-medium text-amber-500 font-mono">Rs. {pay.amountPKR.toLocaleString()}</td>
                    <td className="p-4 text-center font-sans font-medium">{pay.method}</td>
                    <td className="p-4 text-right font-mono text-neutral-500 hidden md:table-cell max-w-[180px] truncate" title={pay.details}>
                      {pay.details}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                        pay.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {pay.status === 'paid' ? t('paid') : t('pending')}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        id={`btn-view-invoice-${pay.id}`}
                        onClick={() => setSelectedPayout(pay)}
                        className="bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-neutral-300 cursor-pointer inline-flex items-center gap-1 transition-colors mx-auto"
                      >
                        <Receipt className="w-3 h-3 text-amber-400" />
                        {t('viewInvoice')}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice modal overlay */}
      <AnimatePresence>
        {selectedPayout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="invoice-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-neutral-200"
              dir={isUrdu ? 'rtl' : 'ltr'}
            >
              <button
                id="btn-close-invoice"
                onClick={() => setSelectedPayout(null)}
                className="absolute top-4 right-4 p-2 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Invoice slip header container */}
              <div className="text-center pt-2 pb-5 border-b border-neutral-800">
                <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold tracking-wide font-sans">{t('invoiceTitle')}</h3>
                <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-mono mt-1">Receipt ID: {selectedPayout.id.toUpperCase()}</p>
              </div>

              {/* Receipt Body */}
              <div className="py-5 space-y-4 font-sans text-xs">
                {/* Amount segment */}
                <div className="flex justify-between items-center bg-neutral-950/45 p-4 rounded-2xl border border-neutral-800">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">{isUrdu ? "مجموعی بنے والی رقم:" : "Total Reward Paid"}</span>
                    <span className="text-2xl font-black text-neutral-100 font-mono">${selectedPayout.amount.toFixed(2)} USD</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">{isUrdu ? "پاکستانی روپے میں قدر:" : "Converted Currency"}</span>
                    <span className="text-base font-bold text-amber-500 font-mono">Rs. {selectedPayout.amountPKR.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3 px-1">
                  <div className="flex justify-between border-b border-neutral-850 pb-2">
                    <span className="text-neutral-400">{t('publisherName')}:</span>
                    <span className="font-bold text-neutral-200">
                      {publishers.find(p => p.id === selectedPayout.publisherId)?.name || 'Unknown'}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-neutral-850 pb-2">
                    <span className="text-neutral-400">{t('date')}:</span>
                    <span className="font-mono text-neutral-200">{selectedPayout.date}</span>
                  </div>

                  <div className="flex justify-between border-b border-neutral-850 pb-2">
                    <span className="text-neutral-400">{t('paymentMethod')}:</span>
                    <span className="font-semibold text-neutral-200">{selectedPayout.method}</span>
                  </div>

                  <div className="flex justify-between border-b border-neutral-850 pb-2">
                    <span className="text-neutral-400">{isUrdu ? "منتقلی تفصیل / والٹ:" : "Wallet details:"}:</span>
                    <span className="font-mono text-neutral-200 text-right max-w-[200px] break-all">{selectedPayout.details}</span>
                  </div>

                  {selectedPayout.txid && (
                    <div className="flex justify-between border-b border-neutral-850 pb-2">
                      <span className="text-neutral-400">{isUrdu ? "ریفرنس ہیش / TXID:" : "Transaction ID / TXID:"}</span>
                      <span className="font-mono text-emerald-400 font-bold select-all break-all">{selectedPayout.txid}</span>
                    </div>
                  )}

                  {selectedPayout.notes && (
                    <div className="flex justify-between border-b border-neutral-850 pb-2">
                      <span className="text-neutral-400">{isUrdu ? "اضافی نوٹس:" : "Notes:"}</span>
                      <span className="text-neutral-300 italic">{selectedPayout.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Watermark and action panel */}
              <div className="pt-4 border-t border-neutral-800 flex flex-col items-center gap-3">
                <span className="text-[9px] text-emerald-400 tracking-widest font-black uppercase flex items-center gap-1 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  🛡️ Adsterra Publisher Network Verification
                </span>

                <div className="flex gap-2 w-full mt-1">
                  <button
                    onClick={handlePrint}
                    className="flex-1 bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    {isUrdu ? "رسید پرنٹ کریں" : "Print Voucher"}
                  </button>
                  <button
                    onClick={() => setSelectedPayout(null)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {isUrdu ? "بند کریں" : "Dismiss"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
