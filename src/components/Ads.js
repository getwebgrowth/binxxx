export function AdSlot({ width = "100%", height = "100px", text = "ADVERTISEMENT SPACE" }) {
  return (
    <div 
      className="bg-gray-100/80 border border-dashed border-gray-300 rounded-xl flex items-center justify-center relative overflow-hidden group"
      style={{ width, height, minHeight: height }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
      <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">{text}</span>
      <div className="absolute bottom-2 right-2 flex items-center gap-1">
        <span className="text-[8px] bg-white/80 px-1.5 py-0.5 rounded text-gray-400 font-mono">Sponsored</span>
      </div>
    </div>
  );
}

export function LinkAd({ text, href = "#" }) {
  return (
    <a href={href} className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline tracking-wide px-2 border-r border-gray-200 last:border-r-0">
      {text}
    </a>
  );
}
