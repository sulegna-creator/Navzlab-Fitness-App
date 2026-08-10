import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, CreditCard, Award, ArrowRight, QrCode, Building2, Smartphone, AlertCircle, Upload, Settings, Edit2, Camera, Check } from 'lucide-react';

interface IapCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPurchase: () => void;
}

type PaymentMethod = 'gcash' | 'maya' | 'maribank' | 'card';

interface SellerPaymentDetails {
  accountName: string;
  gcashName: string;
  gcashNumber: string;
  gcashQrImage: string | null;
  mayaName: string;
  mayaHandle: string;
  mayaNumber: string;
  mayaQrImage: string | null;
  maribankName: string;
  maribankAccNo: string;
  maribankQrImage: string | null;
}

const DEFAULT_PAYMENT_DETAILS: SellerPaymentDetails = {
  accountName: 'JUN MARIE NAVARRO',
  gcashName: 'J** MA**E N.',
  gcashNumber: '+63 991 314 5193',
  gcashQrImage: null,
  mayaName: 'JUN MARIE NAVARRO',
  mayaHandle: '@jm_navz',
  mayaNumber: '+63 *** *** 5193',
  mayaQrImage: null,
  maribankName: 'JUN MARIE NAVARRO',
  maribankAccNo: '1234-5678-9012',
  maribankQrImage: null,
};

export const IapCheckoutModal: React.FC<IapCheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmPurchase,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [refNumber, setRefNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditingSellerInfo, setIsEditingSellerInfo] = useState(false);

  // Seller Payment Config State
  const [sellerDetails, setSellerDetails] = useState<SellerPaymentDetails>(() => {
    const saved = localStorage.getItem('navzlab_seller_payment_details');
    return saved ? JSON.parse(saved) : DEFAULT_PAYMENT_DETAILS;
  });

  useEffect(() => {
    localStorage.setItem('navzlab_seller_payment_details', JSON.stringify(sellerDetails));
  }, [sellerDetails]);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirmPurchase();
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'gcash' | 'maribank') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'gcash') {
          setSellerDetails(prev => ({ ...prev, gcashQrImage: result }));
        } else {
          setSellerDetails(prev => ({ ...prev, maribankQrImage: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">In-App Purchase Store</h3>
              <p className="text-xs text-slate-400">GCash, Maya, MariBank Direct VIP Upgrade</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEditingSellerInfo(!isEditingSellerInfo)}
              title="Seller Payment Settings"
              className={`p-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                isEditingSellerInfo
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isEditingSellerInfo ? (
            /* Seller Payment Setup Panel */
            <div className="space-y-4 bg-slate-800/50 p-4 rounded-2xl border border-amber-500/30">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-amber-400 flex items-center gap-1.5">
                  <Settings className="w-4 h-4" /> Seller QR Code & Payment Setup
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditingSellerInfo(false)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-bold flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Done
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Configure your account details and upload your GCash/Maya or MariBank QR Code images so buyers scan and send payments 100% directly to you!
              </p>

              {/* Account Details Form */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Account Holder Name:</label>
                  <input
                    type="text"
                    value={sellerDetails.accountName}
                    onChange={(e) => setSellerDetails({ ...sellerDetails, accountName: e.target.value, maribankName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. JUNAX M."
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">GCash / Maya Mobile Number:</label>
                  <input
                    type="text"
                    value={sellerDetails.gcashNumber}
                    onChange={(e) => setSellerDetails({ ...sellerDetails, gcashNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-mono focus:outline-none focus:border-amber-400"
                    placeholder="0917-123-4567"
                  />
                </div>

                {/* GCash QR Upload */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-slate-300 font-semibold block">GCash / Maya QR Code Image:</label>
                  <div className="flex items-center gap-3">
                    {sellerDetails.gcashQrImage ? (
                      <div className="relative w-20 h-20 bg-white p-1 rounded-xl border border-amber-400 shadow-md">
                        <img src={sellerDetails.gcashQrImage} alt="GCash QR" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setSellerDetails({ ...sellerDetails, gcashQrImage: null })}
                          className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full text-[10px]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex-1 py-3 px-4 rounded-xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer flex items-center justify-center gap-2 text-amber-300 text-xs font-bold transition-all">
                        <Upload className="w-4 h-4" />
                        <span>Upload GCash/Maya QR Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleQrUpload(e, 'gcash')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60">
                  <label className="text-slate-300 font-semibold block mb-1">MariBank Account Number:</label>
                  <input
                    type="text"
                    value={sellerDetails.maribankAccNo}
                    onChange={(e) => setSellerDetails({ ...sellerDetails, maribankAccNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-mono focus:outline-none focus:border-amber-400"
                    placeholder="1234-5678-9012"
                  />
                </div>

                {/* MariBank QR Upload */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">MariBank QR Code Image:</label>
                  <div className="flex items-center gap-3">
                    {sellerDetails.maribankQrImage ? (
                      <div className="relative w-20 h-20 bg-white p-1 rounded-xl border border-emerald-400 shadow-md">
                        <img src={sellerDetails.maribankQrImage} alt="MariBank QR" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setSellerDetails({ ...sellerDetails, maribankQrImage: null })}
                          className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full text-[10px]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex-1 py-3 px-4 rounded-xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 text-emerald-300 text-xs font-bold transition-all">
                        <Upload className="w-4 h-4" />
                        <span>Upload MariBank QR Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleQrUpload(e, 'maribank')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="text-xl font-extrabold text-white font-display">VIP Unlocked Successfully!</h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Lifetime VIP Pass activated! All ads removed & all Pro modules unlocked forever.
              </p>
            </div>
          ) : (
            <>
              {/* Product Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-800 to-slate-800 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">One-Time Lifetime Pass</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    100% DIRECT PAYMENT
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white font-display">NAVZLAB VIP Pass</h4>
                    <p className="text-xs text-slate-400">Ad-Free + Unlimited AI Coaching</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-300 font-display">₱300.00</span>
                    <span className="text-[10px] text-slate-400 block">($4.99 USD)</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Payment Option:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gcash')}
                    className={`p-2 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'gcash'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-bold text-center">GCash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('maya')}
                    className={`p-2 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'maya'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-center">Maya</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('maribank')}
                    className={`p-2 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'maribank'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-bold text-center">MariBank</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="text-[10px] font-bold text-center">Instant</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handlePay} className="space-y-4">
                {/* GCash Display */}
                {paymentMethod === 'gcash' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-900/60 to-slate-900 border border-blue-500/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1.5 text-blue-300">
                        <QrCode className="w-4 h-4" />
                        GCash Official QR Payment:
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] border border-blue-500/30">InstaPay QR PH</span>
                    </div>

                    {/* GCash Blue Card UI */}
                    <div className="bg-[#0052cc] p-4 rounded-2xl text-white text-center space-y-3 shadow-xl">
                      <div className="flex items-center justify-center gap-1 font-black text-lg tracking-tight">
                        <span className="bg-white text-[#0052cc] rounded-full w-6 h-6 inline-flex items-center justify-center font-extrabold text-xs">G</span>
                        <span>GCash</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl text-slate-900 shadow-inner flex flex-col items-center justify-center space-y-2">
                        {sellerDetails.gcashQrImage ? (
                          <img
                            src={sellerDetails.gcashQrImage}
                            alt="GCash QR Code"
                            className="w-44 h-auto rounded-lg object-contain"
                          />
                        ) : (
                          <div className="w-40 h-40 bg-slate-950 p-2 rounded-xl flex flex-col items-center justify-center relative border border-slate-200">
                            <QrCode className="w-28 h-28 text-blue-400" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="px-1.5 py-0.5 bg-red-600 text-white font-extrabold text-[8px] rounded shadow">instaPay</span>
                            </div>
                          </div>
                        )}

                        <p className="text-[9px] text-slate-500 font-medium">Transfer fees may apply.</p>
                        
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-blue-900 tracking-wide">{sellerDetails.gcashName || sellerDetails.accountName}</p>
                          <p className="text-[10px] text-slate-600 font-mono">Mobile No.: {sellerDetails.gcashNumber}</p>
                          <p className="text-[9px] text-slate-400 font-mono">User ID: ..........Y459K8</p>
                        </div>

                        <div className="pt-1 border-t border-slate-200 w-full">
                          <p className="text-base font-black text-blue-900">₱ 300.00</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditingSellerInfo(true)}
                        className="text-[10px] text-blue-200 hover:text-white underline font-semibold flex items-center justify-center gap-1 mx-auto"
                      >
                        <Camera className="w-3 h-3" />
                        <span>{sellerDetails.gcashQrImage ? 'Update GCash QR Image' : '📷 Change / Upload Actual GCash QR Image'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-medium block mb-1">
                        GCash Reference No. (from GCash receipt):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1002 849 2039"
                        value={refNumber}
                        onChange={(e) => setRefNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Maya Display */}
                {paymentMethod === 'maya' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1.5 text-emerald-300">
                        <QrCode className="w-4 h-4" />
                        Maya Official QR Payment:
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">InstaPay QR PH</span>
                    </div>

                    {/* Maya Clean White/Green Card UI */}
                    <div className="bg-slate-100 p-4 rounded-2xl text-slate-900 text-center space-y-2 shadow-xl border border-emerald-200">
                      <div className="w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center font-extrabold text-sm mx-auto shadow">
                        m
                      </div>

                      <div className="space-y-0.5">
                        <h5 className="text-xs font-black text-slate-900 uppercase tracking-tight">{sellerDetails.mayaName || sellerDetails.accountName}</h5>
                        <p className="text-[11px] text-slate-600 font-medium">{sellerDetails.mayaHandle}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{sellerDetails.mayaNumber}</p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
                        {sellerDetails.mayaQrImage ? (
                          <img
                            src={sellerDetails.mayaQrImage}
                            alt="Maya QR Code"
                            className="w-44 h-auto rounded-lg object-contain"
                          />
                        ) : (
                          <div className="w-40 h-40 bg-slate-950 p-2 rounded-xl flex flex-col items-center justify-center relative border border-slate-200">
                            <QrCode className="w-28 h-28 text-emerald-400" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="px-1.5 py-0.5 bg-red-600 text-white font-extrabold text-[8px] rounded shadow">instaPay</span>
                            </div>
                          </div>
                        )}

                        <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[9px] text-slate-500 font-medium">Transfer fees may apply</span>

                        <p className="text-base font-black text-slate-900">₱300.00</p>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-slate-400 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setIsEditingSellerInfo(true)}
                          className="text-emerald-700 hover:text-emerald-900 underline font-semibold flex items-center gap-1"
                        >
                          <Camera className="w-3 h-3" />
                          <span>{sellerDetails.mayaQrImage ? 'Update Maya QR Image' : '📷 Change / Upload Maya QR Image'}</span>
                        </button>
                        <span className="font-extrabold text-emerald-600 text-xs">maya</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-medium block mb-1">
                        Maya Reference / Transaction No.:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Maya Ref 98231"
                        value={refNumber}
                        onChange={(e) => setRefNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* MariBank Display */}
                {paymentMethod === 'maribank' && (
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        Scan & Pay via MariBank (Bank Transfer):
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px]">Instant</span>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 text-center space-y-3">
                      {sellerDetails.maribankQrImage ? (
                        <div className="p-2 bg-white rounded-2xl border-2 border-amber-400 shadow-xl max-w-[180px]">
                          <img
                            src={sellerDetails.maribankQrImage}
                            alt="MariBank QR Code"
                            className="w-full h-auto rounded-xl object-contain"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-white rounded-2xl border-2 border-amber-400 shadow-xl max-w-[160px] relative">
                          <div className="w-32 h-32 bg-slate-950 p-2 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                            <Building2 className="w-20 h-20 text-amber-400" />
                          </div>
                          <p className="text-[9px] text-slate-800 font-bold mt-1 uppercase tracking-wider">MariBank PH Transfer</p>
                        </div>
                      )}

                      <div className="w-full bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1 text-xs text-left">
                        <div className="flex justify-between text-slate-300">
                          <span>Bank Name:</span>
                          <span className="font-bold text-white">MariBank PH</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Account Name:</span>
                          <span className="font-bold text-white">{sellerDetails.maribankName || sellerDetails.accountName}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Account Number:</span>
                          <span className="font-mono font-bold text-amber-400 select-all">{sellerDetails.maribankAccNo}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Amount:</span>
                          <span className="font-bold text-emerald-400">₱300.00</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditingSellerInfo(true)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1"
                      >
                        <Camera className="w-3 h-3" />
                        <span>{sellerDetails.maribankQrImage ? 'Change QR Image' : '📷 Upload Your MariBank QR Code'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-medium block mb-1">
                        MariBank Ref / Sender Name:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MariBank Ref 98231"
                        value={refNumber}
                        onChange={(e) => setRefNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-white font-bold mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Instant VIP Activation</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Activates VIP access immediately on this device for testing, or processes online payment.
                    </p>
                  </div>
                )}

                {/* Security Note */}
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-2 text-[11px] text-slate-400">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    When hosted directly without Amazon/Play Store, payments go <strong>100% directly</strong> to your GCash / Maya / MariBank with 0% platform fee!
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 text-slate-950 font-black text-sm hover:from-amber-300 hover:to-emerald-300 flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying & Activating VIP...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Activate VIP Access (₱300.00)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


