import React, { useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

interface AdMobBannerProps {
  publisherId?: string;
  adSlot?: string;
  className?: string;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({
  publisherId = 'ca-app-pub-3940256099942544', // Default to Google Test ID
  adSlot = '6300978111', // Default to Google Test Banner ID
  className = ''
}) => {

  useEffect(() => {
    const initializeAndShowBanner = async () => {
      try {
        // Initialize AdMob (Safe to call multiple times)
        await AdMob.initialize({
          testingDevices: [],
          initializeForTesting: true, // Set to false when you go to Play Store!
        });

        // Show the banner at the bottom center
        await AdMob.showBanner({
          adId: adSlot, 
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 65, // This keeps it above your bottom navigation bar
          isTesting: true // Set to false when using your REAL ca-app-pub ID
        });
      } catch (e) {
        console.error('Native AdMob Banner Error:', e);
      }
    };

    initializeAndShowBanner();

    // CLEANUP: Hide the ad when the user leaves this page 
    // This prevents ads from "stacking" or showing on pages where they aren't wanted
    return () => {
      AdMob.removeBanner();
    };
  }, [adSlot]);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-3 ${className}`}>
      {/* 
          Note: On a real device, the ad is injected as a "Native Layer" 
          over the app. This HTML box below acts as a visual placeholder 
          and label for your professional dashboard look.
      */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1 px-1">
          <span className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider text-[9px]">
              AD ACTIVE
            </span>
            <span>Navzlab Premium Revenue</span>
          </span>
          <span className="text-slate-500 font-mono text-[9px]">ID: ...{adSlot.slice(-4)}</span>
        </div>

        {/* This height placeholder ensures the page content doesn't "jump" when the ad loads */}
        <div className="w-full h-[50px] bg-slate-950/50 rounded-xl flex items-center justify-center border border-slate-800/60">
           <span className="text-[9px] text-slate-600 animate-pulse">Loading Secured Ad Slot...</span>
        </div>
      </div>
    </div>
  );
};
