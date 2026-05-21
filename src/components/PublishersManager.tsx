/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, PhoneCall, Gift, Check, ShieldCheck, UserMinus, UserCheck } from 'lucide-react';
import { Publisher } from '../types';
import { translations } from '../data';

interface PublishersManagerProps {
  publishers: Publisher[];
  onAddPublisher: (newPub: Publisher) => void;
  onTogglePublisherStatus: (id: string) => void;
  language: 'en' | 'ur';
}

export function PublishersManager({
  publishers,
  onAddPublisher,
  onTogglePublisherStatus,
  language
}: PublishersManagerProps) {
  const t = (key: string) => translations[key]?.[language] || key;
  const isUrdu = language === 'ur';

  // State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [payoutRate, setPayoutRate] = useState<number>(80);
  const [paymentMethod, setPaymentMethod] = useState('Easypaisa');
  const [paymentDetails, setPaymentDetails] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !paymentDetails) return;

    const newPub: Publisher = {
      id: "pub_" + Date.now(),
      name,
      contact,
      joinedDate: new Date().toISOString().split('T')[0],
      payoutRate: Number(payoutRate),
      status: 'active',
      paymentMethod,
      paymentDetails
    };

    onAddPublisher(newPub);

    // Reset Form
    setName('');
    setContact('');
    setPaymentDetails('');
    setPayoutRate(80);
    setShowAddForm(false);
  };

  return (
    <div className="bg-neutral-900/40 rounded-3xl border border-neutral-800 p-6 backdrop-blur-md" id="publishers-manager-section" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-50 tracking-wide font-sans">{t('publishers')}</h2>
            <p className="text-neutral-400 text-xs mt-1">
              {isUrdu 
                ? "اپنی پبلیشرز ٹیم کے ممبرز، ان کی کمیشن فیصد اور ادائیگی کی تفصیلات سیٹ کریں" 
                : "Manage your network of publishers, set custom commission payouts percentage and payment details"}
            </p>
          </div>
        </div>

        <button
          id="btn-toggle-add-publisher"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? t('cancel') : t('addNewPublisher')}
        </button>
      </div>

      {/* Add Publisher Form Overlay */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-neutral-950/40 border border-neutral-800/80 p-5 rounded-2xl mb-6 space-y-4 overflow-hidden"
          >
            <h3 className="text-xs uppercase tracking-wider text-emerald-400 font-bold font-sans">
              {isUrdu ? "نیا پبلیشر رجسٹریشن فارم" : "Register Publisher Profile"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('publisherName')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ali Hamza"
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('contactInfo')}</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g., WhatsApp: +92 300 1234567 / Telegram"
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Payout share % */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('payoutRatePct')}</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={payoutRate}
                  onChange={(e) => setPayoutRate(parseInt(e.target.value) || 80)}
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Payment Method selection */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('paymentMethod')}</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-emerald-500 font-sans"
                >
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="USDT TRC20">USDT TRC20</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              {/* Payment Wallet details */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{isUrdu ? "والٹ نمبر / بینک تفصیل:" : "Preferred details:"}</label>
                <input
                  type="text"
                  required
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  placeholder="0300-1234567 / USDT Address"
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>

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
                className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs py-2 px-4 rounded-lg cursor-pointer"
              >
                {t('save')}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Publishers List Grid */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-neutral-950/60 border-b border-neutral-800 text-[10px] text-neutral-400 uppercase tracking-widest">
              <th className="p-4 text-left">{t('publisherName')}</th>
              <th className="p-4 text-center">{t('contactInfo')}</th>
              <th className="p-4 text-center">{isUrdu ? "شمولیت کی تاریخ" : "Joined Date"}</th>
              <th className="p-4 text-right text-emerald-400">{t('payoutRatePct')}</th>
              <th className="p-4 text-center">{t('paymentMethod')}</th>
              <th className="p-4 text-right">{isUrdu ? "ادائیگی کا اکاؤنٹ" : "Account details"}</th>
              <th className="p-4 text-center">{t('status')}</th>
              <th className="p-4 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-xs">
            {publishers.map((pub) => (
              <tr key={pub.id} className="hover:bg-neutral-900/20 text-neutral-200">
                <td className="p-4 text-left font-bold text-neutral-50 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  {pub.name}
                </td>
                <td className="p-4 text-center text-neutral-300 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-cyan-400 shrink-0" />
                    {pub.contact}
                  </span>
                </td>
                <td className="p-4 text-center font-mono text-neutral-450">{pub.joinedDate}</td>
                <td className="p-4 text-right font-bold text-emerald-400 font-mono text-sm">{pub.payoutRate}%</td>
                <td className="p-4 text-center font-semibold text-amber-500">{pub.paymentMethod}</td>
                <td className="p-4 text-right font-mono text-neutral-300 max-w-[160px] truncate" title={pub.paymentDetails}>
                  {pub.paymentDetails}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                    pub.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {pub.status === 'active' ? t('active') : t('inactive')}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onTogglePublisherStatus(pub.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] cursor-pointer transition-colors font-bold ${
                      pub.status === 'active'
                        ? 'bg-rose-500/5 hover:bg-rose-500/15 border border-rose-950 text-rose-400'
                        : 'bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-950 text-emerald-400'
                    }`}
                  >
                    {pub.status === 'active' ? (isUrdu?'غیر فعال کریں':'Deactivate') : (isUrdu?'فعال کریں':'Activate')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
