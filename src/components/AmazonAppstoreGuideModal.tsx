import React from 'react';
import { X, ExternalLink, Download, ShoppingBag, Smartphone, Check, Sparkles, Shield, DollarSign } from 'lucide-react';

interface AmazonAppstoreGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmazonAppstoreGuideModal: React.FC<AmazonAppstoreGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Publish to Amazon Appstore</h3>
              <p className="text-xs text-slate-400">100% Free Developer Account & Earn from Downloads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
          {/* Key Advantages */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <DollarSign className="w-4 h-4" /> $0 Upfront Cost Benefit
            </div>
            <p className="text-xs text-slate-200">
              Unlike Google Play Store ($25 one-time fee) or Apple App Store ($99/yr), the <strong className="text-amber-300">Amazon Appstore developer registration is 100% FREE</strong> with no fee at all!
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Simple Step-by-Step Publishing Guide
            </h4>

            <div className="space-y-3">
              <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-white text-xs">Export Codebase</div>
                  <p className="text-xs text-slate-400">
                    Go to the top header in AI Studio, click <strong>Settings &rarr; Export to ZIP</strong> (or GitHub) to download your full React project.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-white text-xs">Bundle as Android APK or PWA</div>
                  <p className="text-xs text-slate-400">
                    Use <strong>Capacitor</strong> (e.g. <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">npx cap add android</code>) or PWABuilder to generate a signed APK / Android App Bundle file for $0.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-white text-xs">Register at Amazon Developer Portal</div>
                  <p className="text-xs text-slate-400">
                    Create a free account at <strong>developer.amazon.com</strong>. Upload your APK, fill in description & icon, and set your app price or Ad settings.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-white text-xs">Publish in AI Studio Web App</div>
                  <p className="text-xs text-slate-400">
                    Click the <strong>Publish</strong> button at the top-right menu of AI Studio to get an instant live web app URL (e.g., <code className="text-emerald-300">navzlab-health-and-fitness-monitor.ai.studio</code>).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Earn */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <h5 className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Monetization & Ad Earnings Strategy
            </h5>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong>In-App Rewarded Ads:</strong> Users watch short video ads to unlock Pro workouts or AI meal plans.</li>
              <li><strong>Amazon In-App Ads / AdMob:</strong> Display non-intrusive banner ads inside your Android app.</li>
              <li><strong>Amazon Coins & In-App Purchases:</strong> Sell optional Pro passes while keeping core features 100% free.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
