const watermarkStyle = {
  maskImage: "url(/watermark.png)",
  WebkitMaskImage: "url(/watermark.png)",
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
  backgroundColor: "var(--color-primary)",
} as const;

export function WatermarkBg() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.04] blur-[0.5px]"
        style={watermarkStyle}
      />
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={
        "relative flex h-12 w-12 shrink-0 items-center justify-center md:h-14 md:w-14 " +
        (className ?? "")
      }
      style={watermarkStyle}
    />
  );
}
