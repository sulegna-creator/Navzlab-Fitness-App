import React, { useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

export const AdMobBanner: React.FC = () => {
  useEffect(() => {
    const initBanner = async () => {
      try {
        await AdMob.showBanner({
          adId: 'ca-app-pub-3940256099942544/6300978111', // Test ID
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 60,
          isTesting: true
        });
      } catch (e) { console.error('AdMob Error', e); }
    };
    initBanner();
    return () => { AdMob.hideBanner(); };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-sm h-[60px] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
         <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Ad Slot Secured</span>
      </div>
    </div>
  );
};
