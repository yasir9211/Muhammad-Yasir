/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Plus, Copy, Check, Link2, ExternalLink, Trash2, ShieldAlert } from 'lucide-react';
import { Publisher, SmartLink } from '../types';
import { translations } from '../data';

interface SmartLinksManagerProps {
  smartLinks: SmartLink[];
  publishers: Publisher[];
  onAddSmartLink: (newLink: SmartLink) => void;
  onDeleteSmartLink: (id: string) => void;
  language: 'en' | 'ur';
}

export function SmartLinksManager({
  smartLinks,
  publishers,
  onAddSmartLink,
  onDeleteSmartLink,
  language
}: SmartLinksManagerProps) {
  const t = (key: string) => translations[key]?.[language] || key;
  const isUrdu = language === 'ur';

  // State
  const [showAddForm, setShowAddForm] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [sourceCompany, setSourceCompany] = useState('Adsterra');
  const [originalUrl, setOriginalUrl] = useState('');
  const [assignedPubId, setAssignedPubId] = useState(publishers[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!linkName || !originalUrl || !assignedPubId) return;

    const newLink: SmartLink = {
      id: "link_" + Date.now(),
      name: linkName,
      sourceCompany,
      originalUrl,
      assignedPublisherId: assignedPubId,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    onAddSmartLink(newLink);
    // Reset Form
    setLinkName('');
    setOriginalUrl('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-neutral-900/40 rounded-3xl border border-neutral-800 p-6 backdrop-blur-md" id="smart-links-section" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-50 tracking-wide font-sans">{t('smartLinks')}</h2>
            <p className="text-neutral-400 text-xs mt-1">
              {isUrdu 
                ? "ایڈ کمپنی کے لنکس کو اپنی پبلیشرز ٹیم میں با آسانی تقسیم کریں" 
                : "Distribute company smart links and direct URLs to your publisher team"}
            </p>
          </div>
        </div>

        <button
          id="btn-toggle-add-link"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-500 hover:bg-indigo-400 text-neutral-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? t('cancel') : t('addNewSmartLink')}
        </button>
      </div>

      {/* Add Smart Link Form Overlay */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-neutral-950/40 border border-neutral-800/80 p-5 rounded-2xl mb-6 space-y-4 overflow-hidden"
          >
            <h3 className="text-xs uppercase tracking-wider text-indigo-400 font-bold font-sans">
              {isUrdu ? "نیا سمارٹ لنک درج فارم" : "Link Input Details"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('linkName')}</label>
                <input
                  type="text"
                  required
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="e.g., Worldwide Direct Link 3"
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{isUrdu ? "اشتہار کمپنی کا نام:" : "Ad network brand:"}</label>
                <input
                  type="text"
                  required
                  value={sourceCompany}
                  onChange={(e) => setSourceCompany(e.target.value)}
                  placeholder="e.g., Adsterra, Monetag"
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('adsterraUrl')}</label>
                <input
                  type="url"
                  required
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://landing.adsterra.com/..."
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">{t('assignedPublisher')}</label>
                <select
                  value={assignedPubId}
                  onChange={(e) => setAssignedPubId(e.target.value)}
                  className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-3 rounded-lg border border-neutral-800 focus:outline-none focus:border-indigo-500 font-sans"
                >
                  {publishers.map((pub) => (
                    <option key={pub.id} value={pub.id}>
                      {pub.name}
                    </option>
                  ))}
                </select>
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
                className="bg-indigo-500 hover:bg-indigo-400 text-neutral-950 font-bold text-xs py-2 px-4 rounded-lg cursor-pointer"
              >
                {t('save')}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Links List Table Grid */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-right md:-ms-0 border-collapse">
          <thead>
            <tr className="bg-neutral-950/60 border-b border-neutral-800 text-[10px] text-neutral-400 uppercase tracking-widest">
              <th className="p-4 text-left">{t('linkName')}</th>
              <th className="p-4 text-center">{isUrdu ? "نیٹ ورک" : "Company"}</th>
              <th className="p-4 text-center">{isUrdu ? "پبلیشر" : "Publisher"}</th>
              <th className="p-4 text-right hidden lg:table-cell">{isUrdu ? "اصل یو آر ایل" : "Original URL"}</th>
              <th className="p-4 text-right">{isUrdu ? "تفویض کردہ ٹریکنگ لنک" : "Tracking SmartLink"}</th>
              <th className="p-4 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-xs">
            {smartLinks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-neutral-500">{t('noData')}</td>
              </tr>
            ) : (
              smartLinks.map((link) => {
                const assignedPubName = publishers.find(p => p.id === link.assignedPublisherId)?.name || 'Unassigned';
                // Append SubID parameter simulating dynamic tracking link redirect!
                const trackingSmartUrl = `${link.originalUrl}${link.originalUrl.includes('?') ? '&' : '?'}subid=${assignedPubName.replace(/\s+/g, '')}`;

                return (
                  <tr key={link.id} className="hover:bg-neutral-900/20 text-neutral-200">
                    {/* Link details */}
                    <td className="p-4 text-left font-semibold text-neutral-50">{link.name}</td>
                    
                    {/* Ad Platform */}
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide rounded-full bg-neutral-950/60 border border-neutral-800 text-indigo-400">
                        {link.sourceCompany}
                      </span>
                    </td>

                    {/* Assigned Publisher */}
                    <td className="p-4 text-center font-medium text-amber-400">{assignedPubName}</td>

                    {/* Original link */}
                    <td className="p-4 text-right max-w-xs truncate text-neutral-500 font-mono hidden lg:table-cell">{link.originalUrl}</td>

                    {/* Generated tracking URL of Smart Link */}
                    <td className="p-4 text-right max-w-[200px] md:max-w-xs truncate text-emerald-400 font-mono font-bold select-all">
                      {trackingSmartUrl}
                    </td>

                    {/* Copy and delete action items */}
                    <td className="p-4 text-center flex items-center justify-center gap-2">
                      <button
                        title="Copy designated link to distribute"
                        onClick={() => handleCopy(link.id, trackingSmartUrl)}
                        className={`p-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1 ${
                          copiedId === link.id
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {copiedId === link.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">{t('copied')}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px]">{isUrdu ? "کاپی کریں" : "Copy"}</span>
                          </>
                        )}
                      </button>

                      <button
                        title="Delete this Link"
                        onClick={() => {
                          if (confirm(isUrdu ? "کیا آپ اس لنک کو ہٹانا چاہتے ہیں؟" : "Are you sure you want to delete this link?")) {
                            onDeleteSmartLink(link.id);
                          }
                        }}
                        className="p-2 bg-rose-500/5 hover:bg-rose-500/15 border border-rose-950 text-rose-400 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-indigo-950/10 border border-indigo-950 rounded-xl">
        <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <span className="text-[11px] text-neutral-400 leading-relaxed font-sans">
          {isUrdu 
            ? "ہمارا سمارٹ لنک جنریٹر خود بخود پبلیشر کا سب آئی ڈی (subid) شامل کر دیتا ہے، تاکہ جب آپ کو Adsterra کی طرف سے امپریشنز اور ریونیو حاصل ہو تو آپ ہر ممبر کا نام فلٹر کر کے حساب کر سکیں۔"
            : "The Smart Link system auto-injects individual publisher keys under the query parameters. When checking Adsterra dashboard, you can filter by those custom SubIDs to accurately log impressions."}
        </span>
      </div>
    </div>
  );
}
