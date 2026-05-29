"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Megaphone, 
  Sparkles, 
  Eye, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Check,
  Upload,
  Coins,
  Send,
  Loader2,
  Globe,
  Info,
  Layers,
  FileImage,
  Link2,
  ChevronRight,
  Flame,
  MousePointerClick,
  Monitor,
  Copy,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function BookAdClient() {
  const [activeTab, setActiveTab] = useState("Banner"); // "Banner", "Text"
  const [selectedSlot, setSelectedSlot] = useState("banner-1");
  const [duration, setDuration] = useState("weekly"); // "weekly", "biweekly", "monthly", "2months", "3months", "6months", "1year"
  const [buyerInfo, setBuyerInfo] = useState({
    adTitle: "",
    adLink: "",
    contactInfo: "",
    paymentType: "Bitcoin"
  });
  
  const [filePreview, setFilePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  // 5 Banner Slots (Row 1 & 2) and 4 Text Slots
  const adSlots = [
    {
      id: "banner-1",
      name: "Header Banner Slot #1",
      type: "Banner",
      specs: "468x64 px (Aspect 4:1)",
      placement: "Premium Header Placement",
      impressions: "~45,000 / day",
      ctr: "1.4% - 2.1%",
      description: "Highest visibility placement in the top site header. Grabs user focus immediately upon load."
    },
    {
      id: "banner-2",
      name: "Header Banner Slot #2",
      type: "Banner",
      specs: "468x64 px (Aspect 4:1)",
      placement: "Middle Header Placement",
      impressions: "~52,000 / day",
      ctr: "1.8% - 2.6%",
      description: "Located in the center of the main header. The absolute highest CTR potential on the platform."
    },
    {
      id: "banner-3",
      name: "Header Banner Slot #3",
      type: "Banner",
      specs: "468x64 px (Aspect 4:1)",
      placement: "Right Header Placement",
      impressions: "~44,000 / day",
      ctr: "1.3% - 2.0%",
      description: "Positioned on the right side of the main header. Ideal for high-contrast colors and interactive elements."
    },
    {
      id: "banner-4",
      name: "Content Banner Slot #4",
      type: "Banner",
      specs: "Aspect 5:1",
      placement: "Above Search Results",
      impressions: "~38,000 / day",
      ctr: "1.1% - 1.7%",
      description: "Renders directly above search results card. Captures audience attention while they analyze data queries."
    },
    {
      id: "banner-5",
      name: "Content Banner Slot #5",
      type: "Banner",
      specs: "Aspect 5:1",
      placement: "Above Database Details",
      impressions: "~37,000 / day",
      ctr: "1.1% - 1.6%",
      description: "Placed immediately above the details lookup container. Targets focused, highly-engaged users."
    },
    {
      id: "text-1",
      name: "Text Link Slot #1",
      type: "Text",
      specs: "Single Line + Slogan",
      placement: "Header Row (Top)",
      impressions: "~60,000 / day",
      ctr: "0.8% - 1.2%",
      description: "Prime text link placement positioned right beneath the main global header bar."
    },
    {
      id: "text-2",
      name: "Text Link Slot #2",
      type: "Text",
      specs: "Single Line + Slogan",
      placement: "Header Row (Bottom)",
      impressions: "~60,000 / day",
      ctr: "0.7% - 1.1%",
      description: "Second text slot. Excellent budget-friendly alternative with consistent impression counts."
    },
    {
      id: "text-3",
      name: "Text Link Slot #3",
      type: "Text",
      specs: "Single Line + Slogan",
      placement: "Footer Row (Left)",
      impressions: "~35,000 / day",
      ctr: "0.5% - 0.8%",
      description: "Placed at the index footer row, captures users who have scrolled through lookup details."
    },
    {
      id: "text-4",
      name: "Text Link Slot #4",
      type: "Text",
      specs: "Single Line + Slogan",
      placement: "Footer Row (Right)",
      impressions: "~35,000 / day",
      ctr: "0.4% - 0.7%",
      description: "Footer right placement. Best for sustaining long-term brand awareness at lowest cost."
    }
  ];

  const currentSlot = adSlots.find(s => s.id === selectedSlot) || adSlots[0];

  // Pricing based on slot type and duration:
  // Banners: $100/weekly, $200/bi-weekly, $400/monthly
  // Links: $50/weekly, $100/bi-weekly, $200/monthly
  const getPrice = (type, dur) => {
    if (type === "Banner") {
      switch (dur) {
        case "weekly": return 100;
        case "biweekly": return 200;
        case "monthly": return 400;
        case "2months": return 750; // Save $50
        case "3months": return 1100; // Save $100
        case "6months": return 2000; // Save $400
        case "1year": return 3600; // Save $1200
        default: return 100;
      }
    } else {
      switch (dur) {
        case "weekly": return 50;
        case "biweekly": return 100;
        case "monthly": return 200;
        case "2months": return 375; // Save $25
        case "3months": return 550; // Save $50
        case "6months": return 1000; // Save $200
        case "1year": return 1800; // Save $600
        default: return 50;
      }
    }
  };

  const totalPrice = getPrice(currentSlot.type, duration);

  const durationOptions = [
    { label: "Weekly", value: "weekly", detail: "7 Days", badge: null, offerText: "" },
    { label: "Bi-Weekly", value: "biweekly", detail: "14 Days", badge: null, offerText: "" },
    { label: "Monthly", value: "monthly", detail: "30 Days", badge: "Popular", offerText: "" },
    { label: "2 Months", value: "2months", detail: "60 Days", badge: "Offer", offerText: "(Offer)" },
    { label: "3 Months", value: "3months", detail: "90 Days", badge: "Offer", offerText: "(Offer)" },
    { label: "6 Months", value: "6months", detail: "180 Days", badge: "Save Big", offerText: "(Save Big)" },
    { label: "1 Year", value: "1year", detail: "365 Days", badge: "Best Deal", offerText: "(Best Deal)" }
  ];

  const currentDurationObj = durationOptions.find(o => o.value === duration) || durationOptions[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBuyerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleTabChange = (type) => {
    setActiveTab(type);
    const firstSlotOfTab = adSlots.find(s => s.type === type);
    if (firstSlotOfTab) {
      setSelectedSlot(firstSlotOfTab.id);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Redirect to Telegram automatically on success screen mounting
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        window.open("https://t.me/mrcheckeradmin", "_blank");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleCopyDetails = () => {
    const detailsText = `AD PLACEMENT ORDER DETAILS:
----------------------------------
Placement Slot: ${currentSlot.name}
Placement Location: ${currentSlot.placement}
Ad Type: ${currentSlot.type}
Campaign Duration: ${currentDurationObj.label} (${currentDurationObj.detail})
Ad Slogan / Title: ${buyerInfo.adTitle}
Destination Source Link: ${buyerInfo.adLink}
Contact Handles: ${buyerInfo.contactInfo}
Payment Method: ${buyerInfo.paymentType}
Total Quoted Price: $${totalPrice}.00 USD
----------------------------------`;
    navigator.clipboard.writeText(detailsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredSlots = adSlots.filter(s => s.type === activeTab);

  return (
    <div className="w-full flex-grow flex flex-col font-sans max-w-6xl mx-auto py-4">
      {/* Header traffic display */}
      <div className="text-center mb-10 animate-fade-up">
        <span className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-950/30 rounded-full border border-blue-200/40 dark:border-blue-900/30 shadow-sm">
          Premium Advertising Placements
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-3 mb-2 flex items-center justify-center gap-2 flex-wrap">
          <Megaphone className="w-8 h-8 text-blue-500 shrink-0" />
          Advertise on CC Bins
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium mb-6">
          Reach a high-intent audience of fintech developers, payment risk analysts, and carding researchers.
        </p>

        {/* Live stats row */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "Daily Views", value: "65,000+", icon: <Eye className="w-3.5 h-3.5 text-blue-500" /> },
            { label: "Monthly Uniques", value: "180,000+", icon: <Globe className="w-3.5 h-3.5 text-indigo-500" /> },
            { label: "Avg. Session", value: "4m 12s", icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
            { label: "Audience", value: "Fintech / Carding", icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm text-xs">
              {stat.icon}
              <span className="text-gray-400 dark:text-gray-500 font-medium">{stat.label}:</span>
              <span className="font-extrabold text-gray-900 dark:text-white font-mono">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {!submitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-up delay-100">
          
          {/* Left Column: Interactive Tabbed Placement & Duration */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Slot selector Card Grid with Tabs */}
            <div className="glass-panel p-6 flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-gray-800 pb-4">
                <h3 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  1. Select Placement Slot
                </h3>
                
                {/* Tab Switcher (Banner vs. Text Links) */}
                <div className="flex bg-gray-100/50 dark:bg-gray-950/60 p-1 border border-gray-200 dark:border-gray-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleTabChange("Banner")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === "Banner"
                        ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-250/20 dark:border-gray-850"
                        : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                    }`}
                  >
                    <FileImage className="w-3.5 h-3.5" />
                    GIF/Video Banners
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange("Text")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === "Text"
                        ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-250/20 dark:border-gray-850"
                        : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    Text Links
                  </button>
                </div>
              </div>

              {/* Slots Grid (Zero clipping or overflows) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.id;
                  const baseWeekly = slot.type === "Banner" ? 100 : 50;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-300 group/item relative overflow-hidden ${
                        isSelected
                          ? "bg-blue-50/10 dark:bg-blue-950/10 border-blue-500 dark:border-blue-500 shadow-md ring-2 ring-blue-500/10"
                          : "bg-white dark:bg-[#0d111c]/60 border-gray-200 dark:border-gray-850 hover:border-gray-350 dark:hover:border-gray-800 hover:shadow-sm"
                      }`}
                    >
                      {/* Corner badge indicating placement type */}
                      <span className={`absolute top-3 right-3 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                        slot.type === "Banner"
                          ? "bg-purple-50 dark:bg-purple-950/30 text-purple-650 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/30"
                          : "bg-amber-50 dark:bg-amber-950/30 text-amber-650 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30"
                      }`}>
                        {slot.type === "Banner" ? "Banner" : "Link"}
                      </span>

                      <span className="font-extrabold text-xs text-gray-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors pr-10 mb-0.5">
                        {slot.name}
                      </span>
                      
                      <span className="text-[10px] text-gray-400 dark:text-gray-550 font-semibold mb-2 block">
                        {slot.specs} • {slot.placement}
                      </span>
                      
                      <p className="text-[10px] text-gray-550 dark:text-gray-400 leading-normal font-medium mb-4 flex-grow">
                        {slot.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-[10px] font-bold mt-auto pt-3 border-t border-gray-150 dark:border-gray-850 w-full text-gray-400 dark:text-gray-505">
                        <span className="flex items-center gap-1">
                          <MousePointerClick className="w-3.5 h-3.5 text-blue-500" />
                          {slot.impressions}
                        </span>
                        <span className="font-mono text-gray-900 dark:text-gray-250 text-xs">${baseWeekly}/week</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campaign Duration Selector */}
            <div className="glass-panel p-6 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider border-b border-gray-150 dark:border-gray-850 pb-3 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                2. Select Campaign Duration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {durationOptions.map((opt) => {
                  const isSelected = duration === opt.value;
                  const price = getPrice(currentSlot.type, opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDuration(opt.value)}
                      className={`p-3.5 rounded-2xl border text-xs flex flex-col items-center justify-center transition-all duration-300 relative group/dur ${
                        isSelected
                          ? "bg-gradient-to-br from-blue-600 to-indigo-650 dark:from-blue-500 dark:to-indigo-550 text-white border-transparent shadow-md scale-[1.02] ring-4 ring-blue-550/10 font-bold"
                          : "bg-white dark:bg-[#0d111c]/60 border-gray-200 dark:border-gray-850 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-800 hover:shadow-sm"
                      }`}
                    >
                      {/* Discount / offer badge */}
                      {opt.badge && (
                        <span className={`absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-0.5 ${
                          isSelected
                            ? "bg-amber-500 text-white"
                            : "bg-red-500 text-white dark:bg-red-950/80 dark:text-red-400"
                        }`}>
                          <Flame className="w-2.5 h-2.5 fill-current animate-pulse" />
                          {opt.badge}
                        </span>
                      )}

                      <span className="font-bold text-sm tracking-tight">{opt.label}</span>
                      <span className={`text-[10px] font-mono mt-1 ${isSelected ? "text-blue-100" : "text-gray-450 dark:text-gray-500"}`}>
                        ${price} ({opt.detail} {opt.offerText})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ad settings assets form details */}
            <form onSubmit={handleFormSubmit} className="glass-panel p-6 flex flex-col gap-5">
              <div className="border-b border-gray-150 dark:border-gray-850 pb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-blue-500" />
                  3. Ad Settings & Assets
                </h3>
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-550">
                  Step 3 of 3
                </span>
              </div>

              {/* No-Follow Alert Callout */}
              <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-3 text-[11px] text-gray-650 dark:text-gray-400 leading-relaxed font-medium">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900 dark:text-amber-400 block mb-0.5">Search Engine Compliant Placements</span>
                  All outbound links on CC Bins employ <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-900 rounded font-mono text-[10px]">rel="nofollow sponsored"</code> attributes. This ensures complete alignment with search engine advertising rules while maintaining direct referrer click integrity.
                </div>
              </div>

              {/* Title / Alt-text */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <label>Ad Title / Slogan Line *</label>
                  <span>{buyerInfo.adTitle.length}/60 chars</span>
                </div>
                <input
                  type="text"
                  name="adTitle"
                  required
                  maxLength={60}
                  placeholder={currentSlot.type === "Banner" ? "e.g. Premium Credit Card Verification Services" : "e.g. ELONMONEY.VIP - EXCLUSIVE CVV SHOP | DAILY UPDATE"}
                  value={buyerInfo.adTitle}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-250 dark:border-gray-850 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-600 font-medium transition-all"
                />
              </div>

              {/* Destination Source Link */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Link to your source *
                </label>
                <input
                  type="url"
                  name="adLink"
                  required
                  placeholder="e.g. https://t.me/yourbrand"
                  value={buyerInfo.adLink}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-250 dark:border-gray-850 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-600 font-medium transition-all"
                />
              </div>

              {/* File selector (only for Banners) */}
              {currentSlot.type === "Banner" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Upload Banner Asset (jpg, png, gif)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="px-4 py-2.5 bg-gray-150 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-850 text-xs font-bold rounded-xl border border-gray-255 dark:border-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Choose file
                    </button>
                    <span className="text-[11px] text-gray-450 dark:text-gray-500 truncate max-w-[200px] font-medium">
                      {fileInputRef.current?.files?.[0]?.name || "No file chosen"}
                    </span>
                  </div>

                  {filePreview && (
                    <div className="mt-2.5 p-2 bg-gray-50/50 dark:bg-gray-950/60 border border-gray-150 dark:border-gray-850 rounded-xl flex flex-col gap-1.5">
                      <span className="text-[9px] uppercase font-bold text-gray-455 tracking-wider">Asset Preview</span>
                      <div className="w-full relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-850 aspect-[4/1] bg-black flex items-center justify-center">
                        <img src={filePreview} alt="Uploaded Banner" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Credentials */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Your email, jabber, tox, TG *
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  required
                  placeholder="Your handle (e.g. TG: @yourhandle)"
                  value={buyerInfo.contactInfo}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-255 dark:border-gray-850 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-600 font-medium transition-all"
                />
              </div>

              {/* Payment Type selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Select Settlement Payment Type
                </label>
                <select
                  name="paymentType"
                  value={buyerInfo.paymentType}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-bold shadow-inner"
                >
                  <option value="Bitcoin">Bitcoin (BTC)</option>
                  <option value="USDT">USDT (TRC-20)</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3.5 mt-2">
                <button
                  type="submit"
                  className="flex-grow py-3 px-5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  Submit Ad Order
                  <Send className="w-3.5 h-3.5" />
                </button>
                <Link
                  href="/"
                  className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-850 rounded-xl transition-all cursor-pointer border border-gray-200 dark:border-gray-800 text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Right Column: Dynamic Live Preview & Analytics */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Live Campaign Preview inside a Mock Web Frame */}
            <div className="glass-panel p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-850 pb-3">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-500" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                    Live Campaign Preview
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-gray-505 bg-gray-100 dark:bg-gray-800">
                  Real-time
                </span>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                <span className="text-gray-500 dark:text-gray-450 text-[10px] leading-normal font-semibold">
                  This simulates how your customized banner/text link will look on the live dashboard:
                </span>

                {/* Mock Browser Layout */}
                <div className="w-full border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-55/10 dark:bg-[#06080e]/50 overflow-hidden shadow-inner flex flex-col">
                  {/* Mock Toolbar */}
                  <div className="px-3.5 py-2.5 bg-gray-100/70 dark:bg-gray-900/60 border-b border-gray-250/50 dark:border-gray-855 flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <div className="bg-white dark:bg-gray-950 px-3 py-0.5 rounded text-[8px] font-mono text-gray-405 ml-4 flex-grow max-w-[200px] border border-gray-200/50 dark:border-gray-800 truncate">
                      https://ccbins.co/
                    </div>
                  </div>

                  {/* Mock Content */}
                  <div className="p-4 flex flex-col items-center justify-center min-h-[140px] bg-white dark:bg-gray-950">
                    
                    {currentSlot.type === "Banner" ? (
                      <div className="w-full flex flex-col gap-2 relative">
                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                          {currentSlot.name} Placement:
                        </span>
                        
                        <div className={`w-full relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-900 to-black ${currentSlot.id.includes("banner-4") || currentSlot.id.includes("banner-5") ? "aspect-[5/1]" : "aspect-[4/1]"} flex items-center justify-center shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20`}>
                          {filePreview ? (
                            <img 
                              src={filePreview} 
                              alt={buyerInfo.adTitle || "Live Preview"} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-3 flex flex-col items-center gap-1 text-gray-400 select-none">
                              <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                              <span className="text-[10px] font-black text-white tracking-widest uppercase">
                                {buyerInfo.adTitle || "YOUR BRAND IMAGE HERE"}
                              </span>
                              <span className="text-[7px] text-gray-405 font-bold">
                                {currentSlot.specs} banner display
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col gap-2 relative">
                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                          {currentSlot.name} Placement:
                        </span>
                        
                        <div className="w-full p-3 bg-gray-55/50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-850 rounded-xl text-center shadow-inner select-none font-bold text-[10px] tracking-wide text-gray-600 dark:text-gray-400 ring-1 ring-blue-500/20">
                          <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[8px] rounded font-mono font-bold mr-1.5 border border-blue-200/50 dark:border-blue-900/30 shrink-0">
                            {currentSlot.name.replace(" Link Slot", "").toUpperCase()}
                          </span>
                          <span className="hover:text-blue-600 cursor-pointer uppercase transition-colors">
                            {buyerInfo.adTitle || "Jerry's CC+CVV Store • Excellent Bases • Click to Buy"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[10px] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>
                    <strong>Design Advice:</strong> Animated GIF or high-contrast graphics can increase card interaction by up to 40% compared to static slogans.
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Analytics Card */}
            <div className="glass-panel p-6 flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-150 dark:border-gray-850 pb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Audience Reach Metrics
              </h3>

              <div className="flex flex-col gap-4">
                {[
                  { label: "Daily Global Page Views", value: "65,000+", pct: 88, color: "bg-blue-500" },
                  { label: "Unique Users Monthly", value: "180,000+", pct: 72, color: "bg-indigo-500" },
                  { label: "Avg. Session Duration", value: "4m 12s", pct: 60, color: "bg-emerald-500" },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">{m.label}</span>
                      <span className="font-bold text-gray-900 dark:text-white font-mono">{m.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-850 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${m.color} opacity-70`}
                        style={{ width: `${m.pct}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100 dark:border-gray-850">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Audience Interests</span>
                  <div className="flex gap-1.5">
                    {["Carding", "Fintech", "Payments"].map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Order Submitted / Connection Details Screen */
        <div className="glass-panel p-8 max-w-lg mx-auto text-center flex flex-col items-center gap-6 animate-fade-up relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center border border-blue-200 dark:border-blue-900/30">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Connecting with Telegram Admin...</h2>
            <p className="text-xs text-gray-550 dark:text-gray-400 mt-2 leading-relaxed max-w-md mx-auto">
              Please wait while we redirect you to Telegram handle <span className="font-extrabold text-blue-600 dark:text-blue-400">@mrcheckeradmin</span> to verify payment details and activate deployment.
            </p>
          </div>

          {/* Copy Order Box */}
          <div className="w-full text-left bg-gray-50/80 dark:bg-gray-950/60 border border-gray-250 dark:border-gray-850 p-5 rounded-2xl flex flex-col gap-3.5 text-xs relative">
            <button
              onClick={handleCopyDetails}
              type="button"
              className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-900 hover:bg-gray-150 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[10px] font-bold"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Details
                </>
              )}
            </button>

            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-850 pb-2 mb-1 pr-24">
              <Sparkles className="w-4.5 h-4.5 text-amber-500" />
              <span className="font-bold text-gray-950 dark:text-white">Clipboard Ad Package Info:</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-450 dark:text-gray-505 font-semibold">Placement Slot:</span>
              <span className="col-span-2 font-bold text-gray-800 dark:text-gray-200">{currentSlot.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-455 dark:text-gray-500 font-semibold">Duration Plan:</span>
              <span className="col-span-2 font-bold text-gray-800 dark:text-gray-200">
                {currentSlot.type} ({currentDurationObj.label})
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-450 dark:text-gray-500 font-semibold">Title / Slogan:</span>
              <span className="col-span-2 font-bold text-gray-800 dark:text-gray-200 truncate">{buyerInfo.adTitle}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-450 dark:text-gray-500 font-semibold">Target Link:</span>
              <span className="col-span-2 font-bold text-gray-800 dark:text-gray-200 break-all select-all">{buyerInfo.adLink}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-450 dark:text-gray-500 font-semibold">Your Contact:</span>
              <span className="col-span-2 font-bold text-gray-800 dark:text-gray-200">{buyerInfo.contactInfo}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-gray-250/50 dark:border-gray-805 pt-2.5">
              <span className="text-gray-450 dark:text-gray-500 font-bold">Total Price Quote:</span>
              <span className="col-span-2 font-bold font-mono text-blue-600 dark:text-blue-400">${totalPrice}.00 USD ({buyerInfo.paymentType})</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2.5">
            <a
              href="https://t.me/mrcheckeradmin"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Open Telegram Directly
              <ExternalLink className="w-4 h-4" />
            </a>
            
            <button
              onClick={() => {
                setSubmitted(false);
                setBuyerInfo({
                  adTitle: "",
                  adLink: "",
                  contactInfo: "",
                  paymentType: "Bitcoin"
                });
                setFilePreview(null);
              }}
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-650 bg-gray-150 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-900 hover:border-gray-700 border border-transparent rounded-xl transition-all cursor-pointer"
            >
              Modify Ad Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
