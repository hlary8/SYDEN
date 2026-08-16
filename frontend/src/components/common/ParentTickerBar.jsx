import LanguageSelector from './LanguageSelector';

export default function ParentTickerBar() {
  return (
    <div className="border-b border-[#1A1A1A] bg-[#0A0A0A] text-[11px] uppercase tracking-[0.1em] text-[#888888]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div>DELEON 1,247.50 ▲ +2.3%</div>
        <div className="flex items-center gap-6">
          <LanguageSelector />
          <div className="cursor-pointer">🔍</div>
        </div>
      </div>
    </div>
  );
}
