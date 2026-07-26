'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Product } from '../types/catalog';
import { BRAND_CONFIG } from '../data/products';

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onClearCart?: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  onClearCart,
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'PREPAID' | 'COD'>('PREPAID');
  const [utrNumber, setUtrNumber] = useState('');

  // UI Feedback
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Price Calculations
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const totalOrderAmount = useMemo(() => {
    return paymentMethod === 'PREPAID'
      ? subtotal
      : subtotal + BRAND_CONFIG.payments.codAdvanceFee;
  }, [paymentMethod, subtotal]);

  const amountToPayNow = useMemo(() => {
    return paymentMethod === 'PREPAID'
      ? subtotal
      : BRAND_CONFIG.payments.codAdvanceFee;
  }, [paymentMethod, subtotal]);

  const balanceOnDelivery = useMemo(() => {
    return paymentMethod === 'COD' ? subtotal : 0;
  }, [paymentMethod, subtotal]);

  // UPI Deep Link & QR Code URL
  const upiUri = useMemo(() => {
    const note = encodeURIComponent(`ZEVRO Order Payment - ${paymentMethod}`);
    return `upi://pay?pa=${BRAND_CONFIG.payments.upiId}&pn=${encodeURIComponent(
      BRAND_CONFIG.name
    )}&am=${amountToPayNow}&cu=INR&tn=${note}`;
  }, [amountToPayNow, paymentMethod]);

  const qrImageUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      upiUri
    )}`;
  }, [upiUri]);

  if (!isOpen) return null;

  // Auto city/state population helper for common Indian pincodes
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    if (val.length === 6) {
      // Basic state inferencing fallback
      const prefix = val.substring(0, 2);
      if (['11', '12', '13'].includes(prefix)) { setCity('Delhi NCR'); setStateName('Delhi'); }
      else if (['40', '41', '42'].includes(prefix)) { setCity('Mumbai'); setStateName('Maharashtra'); }
      else if (['56', '57'].includes(prefix)) { setCity('Bengaluru'); setStateName('Karnataka'); }
      else if (['60', '61'].includes(prefix)) { setCity('Chennai'); setStateName('Tamil Nadu'); }
      else if (['70', '71'].includes(prefix)) { setCity('Kolkata'); setStateName('West Bengal'); }
      else if (['30', '31', '32', '34'].includes(prefix)) { setCity('Jaipur / Jodhpur'); setStateName('Rajasthan'); }
    }
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || pincode.length < 6 || !address.trim()) {
      setFormError('Please complete all required shipping fields correctly (Name, Phone, 6-digit Pincode & Street Address).');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handleNextToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.length < 6) {
      setFormError('Please enter your 12-digit UTR / Payment Transaction ID to confirm payment.');
      return;
    }
    setFormError('');
    setStep(3);
  };

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(BRAND_CONFIG.payments.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 3000);
    }
  };

  // Structured Order Approval payload for WhatsApp
  const generateWhatsAppMessage = () => {
    const itemLines = items.map(
      (item, idx) =>
        `${idx + 1}. *${item.title}*\n   • Size: ${item.selectedSize} | Qty: ${item.quantity}\n   • Price: ₹ ${(item.price * item.quantity).toLocaleString('en-IN')}`
    );

    const paymentHeader =
      paymentMethod === 'PREPAID'
        ? `✅ *PREPAID FULL PAYMENT (UPI)*\n• Total Order Value: ₹ ${subtotal.toLocaleString('en-IN')}\n• Amount Paid via UPI: ₹ ${subtotal.toLocaleString('en-IN')}\n• Balance on Delivery: ₹ 0`
        : `🚚 *CASH ON DELIVERY (COD)*\n• Items Subtotal: ₹ ${subtotal.toLocaleString('en-IN')}\n• Extra COD Fee: ₹ ${BRAND_CONFIG.payments.codAdvanceFee}\n• Total Order Value: ₹ ${totalOrderAmount.toLocaleString('en-IN')}\n• Advance Paid via UPI: ₹ ${BRAND_CONFIG.payments.codAdvanceFee}\n• Balance Due on Delivery: ₹ ${balanceOnDelivery.toLocaleString('en-IN')}`;

    return [
      `🚨 *NEW ZEVRO STORE ORDER APPROVAL REQUEST*`,
      `\n----------------------------------`,
      `👤 *CUSTOMER SHIPPING DETAILS:*`,
      `• *Name:* ${fullName}`,
      `• *Phone/WhatsApp:* ${phone}`,
      `• *Address:* ${address}`,
      `• *City/State:* ${city || 'India'}, ${stateName || ''}`,
      `• *Pincode:* ${pincode}`,
      `\n----------------------------------`,
      `🛍️ *ORDERED SILHOUETTES (${items.length} ITEMS):*`,
      ...itemLines,
      `\n----------------------------------`,
      `💳 *PAYMENT STATUS:*`,
      paymentHeader,
      `• *Payment UTR / Transaction ID:* ${utrNumber}`,
      `\n----------------------------------`,
      `⚡ *ACTION REQUIRED:* Please verify UTR reference and approve dispatch!`,
    ].join('\n');
  };

  const handleSendWhatsAppApproval = () => {
    const message = generateWhatsAppMessage();
    const waUrl = `https://wa.me/${BRAND_CONFIG.socials.whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Copy to clipboard as backup
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
    }

    setIsSubmitted(true);
    window.open(waUrl, '_blank');
    if (onClearCart) onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-body overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="bg-black dark:bg-white/5 text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
              ZEVRO DIRECT CHECKOUT SYSTEM
            </span>
            <h2 className="font-heading text-lg sm:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span>🔒 SECURE ORDER CHECKOUT</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-bold text-sm"
            aria-label="Close Checkout"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Indicator Bar */}
        <div className="bg-gray-100 dark:bg-black/40 border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between text-xs font-bold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-black dark:text-white' : 'text-gray-400'}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${step >= 1 ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 text-gray-500'}`}>1</span>
            <span className="hidden sm:inline">Shipping Address</span>
          </div>

          <div className="h-0.5 w-8 bg-gray-300 dark:bg-white/20" />

          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-black dark:text-white' : 'text-gray-400'}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${step >= 2 ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 text-gray-500'}`}>2</span>
            <span>UPI Payment & QR</span>
          </div>

          <div className="h-0.5 w-8 bg-gray-300 dark:bg-white/20" />

          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-black dark:text-white' : 'text-gray-400'}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</span>
            <span className="hidden sm:inline">WhatsApp Approval</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-600 dark:text-red-400 text-center animate-bounce">
              ⚠️ {formError}
            </div>
          )}

          {/* STEP 1: SHIPPING DETAILS */}
          {step === 1 && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              <div className="border-b border-gray-200 dark:border-white/10 pb-3 flex justify-between items-center">
                <h3 className="font-heading text-sm font-black uppercase text-black dark:text-white flex items-center gap-2">
                  <span>📍 Step 1: Customer & Delivery Address</span>
                </h3>
                <span className="text-xs font-bold text-gray-400">{items.length} Items (₹ {subtotal.toLocaleString('en-IN')})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 p-3 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 p-3 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={handlePincodeChange}
                    placeholder="e.g. 110001"
                    className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 p-3 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City Name"
                    className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 p-3 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="State Name"
                    className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 p-3 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1">
                  Full Street Address & Landmark *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat No., Building, Street Name, Landmark"
                  className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 p-3 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>PROCEED TO UPI PAYMENT →</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD & UPI QR CODE */}
          {step === 2 && (
            <form onSubmit={handleNextToReview} className="space-y-6">
              <div className="border-b border-gray-200 dark:border-white/10 pb-3 flex justify-between items-center">
                <h3 className="font-heading text-sm font-black uppercase text-black dark:text-white flex items-center gap-2">
                  <span>💳 Step 2: Select Payment Method & Scan UPI QR</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white underline"
                >
                  ← Edit Address
                </button>
              </div>

              {/* Payment Mode Selection Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* PREPAID OPTION */}
                <div
                  onClick={() => setPaymentMethod('PREPAID')}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'PREPAID'
                      ? 'border-black dark:border-white bg-black/5 dark:bg-white/10 ring-2 ring-black dark:ring-white'
                      : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading text-xs font-black uppercase text-black dark:text-white flex items-center gap-1.5">
                      <span>⚡ PREPAID (FULL UPI)</span>
                    </span>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[9px] font-bold">
                      FREE EXPRESS AIR SHIPPING
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Pay 100% via UPI QR code now. Fastest priority dispatch & zero extra fees.
                  </p>
                  <div className="mt-3 pt-2 border-t border-gray-200 dark:border-white/10 font-heading text-sm font-black text-black dark:text-white">
                    Pay Now: ₹ {subtotal.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* CASH ON DELIVERY OPTION */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'COD'
                      ? 'border-black dark:border-white bg-black/5 dark:bg-white/10 ring-2 ring-black dark:ring-white'
                      : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading text-xs font-black uppercase text-black dark:text-white flex items-center gap-1.5">
                      <span>🚚 CASH ON DELIVERY (COD)</span>
                    </span>
                    <span className="rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[9px] font-bold">
                      + ₹ 180 EXTRA COD FEE
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Pay <span className="font-bold text-black dark:text-white">₹ 180 advance COD fee now</span> via UPI QR code. Remaining order balance of <span className="font-bold text-black dark:text-white">₹ {subtotal.toLocaleString('en-IN')}</span> paid on delivery.
                  </p>
                  <div className="mt-3 pt-2 border-t border-gray-200 dark:border-white/10 font-heading text-xs font-black text-black dark:text-white flex justify-between">
                    <span>Pay Advance Now: ₹ {BRAND_CONFIG.payments.codAdvanceFee}</span>
                    <span>Due on Delivery: ₹ {subtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive UPI QR Code Box */}
              <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-black p-5 text-white border border-gray-800 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* QR Image Display */}
                  <div className="bg-white p-3 rounded-2xl shadow-inner flex flex-col items-center">
                    <Image
                      src={qrImageUrl}
                      alt="ZEVRO UPI Payment QR Code"
                      width={180}
                      height={180}
                      className="rounded-lg"
                      priority
                      unoptimized
                    />
                    <span className="text-[10px] font-bold text-black uppercase mt-1">
                      SCAN WITH ANY UPI APP
                    </span>
                  </div>

                  {/* Payment Instructions & Details */}
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                        {paymentMethod === 'PREPAID' ? 'FULL PREPAID PAYMENT' : 'COD ADVANCE SHIPPING FEE'}
                      </span>
                      <div className="text-2xl font-heading font-black text-white mt-0.5">
                        ₹ {amountToPayNow.toLocaleString('en-IN')}
                      </div>
                      {paymentMethod === 'COD' && (
                        <span className="text-[11px] font-semibold text-gray-300 block">
                          Remaining ₹ {balanceOnDelivery.toLocaleString('en-IN')} to be paid to delivery agent.
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 bg-white/10 p-3 rounded-xl border border-white/15">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-300 font-medium">Store UPI ID:</span>
                        <span className="font-mono font-bold text-white">{BRAND_CONFIG.payments.upiId}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="w-full rounded-lg bg-white/20 hover:bg-white/30 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors"
                      >
                        {copiedUpi ? '✓ UPI ID COPIED!' : '📋 COPY UPI ID'}
                      </button>
                    </div>

                    <div className="flex justify-center sm:justify-start gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                    </div>
                  </div>
                </div>

                {/* UTR / Transaction ID Input Field */}
                <div className="pt-3 border-t border-white/10 space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-amber-400 block">
                    Enter 12-Digit Payment UTR / Transaction Reference ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.trim())}
                    placeholder="e.g. 420519827361"
                    className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-xs font-mono font-bold text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-gray-400 block">
                    Found in your UPI app receipt (Google Pay, PhonePe, Paytm, BHIM) after scanning.
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-gray-300 dark:border-white/20 px-5 py-4 text-xs font-bold uppercase text-black dark:text-white"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>REVIEW & SUBMIT APPROVAL →</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER REVIEW & WHATSAPP APPROVAL */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-white/10 pb-3 flex justify-between items-center">
                <h3 className="font-heading text-sm font-black uppercase text-black dark:text-white flex items-center gap-2">
                  <span>✅ Step 3: Order Review & WhatsApp Approval</span>
                </h3>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">READY TO DISPATCH</span>
              </div>

              {/* Structured Order Summary Card */}
              <div className="rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 space-y-3 text-xs font-body">
                <div className="flex justify-between items-center font-bold text-gray-500 border-b border-gray-200 dark:border-white/10 pb-2">
                  <span>DELIVERY DESTINATION</span>
                  <span className="text-black dark:text-white font-mono">{pincode}</span>
                </div>

                <div className="space-y-1 text-black dark:text-white">
                  <div className="font-bold">{fullName} ({phone})</div>
                  <div className="text-gray-600 dark:text-gray-300">{address}, {city}, {stateName}</div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-white/10 space-y-2">
                  <div className="font-bold uppercase text-[10px] text-gray-400">ORDERED ITEMS:</div>
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between font-bold text-black dark:text-white text-xs">
                      <span>{item.title} (Size: {item.selectedSize}, Qty: {item.quantity})</span>
                      <span>₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-white/10 space-y-1 font-bold">
                  <div className="flex justify-between text-black dark:text-white">
                    <span>Payment Mode:</span>
                    <span className="text-amber-600 dark:text-amber-400">{paymentMethod === 'PREPAID' ? 'FULL PREPAID (UPI)' : 'COD WITH ₹180 ADVANCE'}</span>
                  </div>
                  <div className="flex justify-between text-black dark:text-white">
                    <span>UPI Amount Paid Now:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">₹ {amountToPayNow.toLocaleString('en-IN')}</span>
                  </div>
                  {paymentMethod === 'COD' && (
                    <div className="flex justify-between text-gray-500">
                      <span>Remaining Balance on Delivery:</span>
                      <span className="text-black dark:text-white font-extrabold">₹ {balanceOnDelivery.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500 font-mono text-[11px] pt-1">
                    <span>UTR Ref ID:</span>
                    <span className="text-black dark:text-white">{utrNumber}</span>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-2 text-center">
                <span className="text-xl block">💬</span>
                <h4 className="font-heading text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400">
                  FINAL STEP: SEND APPROVAL TO WHATSAPP ({BRAND_CONFIG.socials.whatsappDisplay})
                </h4>
                <p className="text-[11px] text-gray-600 dark:text-gray-300">
                  Click the button below to open WhatsApp with your structured order summary & UTR payment reference for instant order verification & tracking!
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleSendWhatsAppApproval}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:opacity-95 active:scale-95 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-white shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-lg">💬</span>
                  <span>SEND ORDER & PAYMENT PROOF ON WHATSAPP →</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full text-center text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white"
                >
                  ← Edit Payment Method / UTR Number
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Note */}
        <div className="bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 px-4 py-3 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <span>24/7 SUPPORT: IG @{BRAND_CONFIG.socials.instagram}</span>
          <span>7-DAY ARCHIVE RETURNS</span>
        </div>
      </div>
    </div>
  );
}
