import React, { useEffect, useRef } from 'react';

interface AdMobBannerProps {
  publisherId?: string;
  adSlot?: string;
  className?: string;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({
  publisherId = 'ca-app-pub-8379818450369013',
  adSlot = '5676564129',
  className = ''
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Load Google Ads / AdSense script if not already present
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Push ad initialization
      if (window && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('AdMob/AdSense Banner load:', e);
    }
  }, [publisherId, adSlot]);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-3 ${className}`}>
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1 px-1">
          <span className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider text-[9px]">
              AdMob
            </span>
            <span>Navzlab Fitness Banner</span>
          </span>
          <span className="text-slate-500 font-mono text-[9px]">ID: {adSlot}</span>
        </div>

        {/* AdSense / AdMob Banner Slot */}
        <div ref={adRef} className="w-full flex items-center justify-center min-h-[50px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800/60">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '50px', textAlign: 'center' }}
            data-ad-client={publisherId}
            data-ad-slot={adSlot}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
};
