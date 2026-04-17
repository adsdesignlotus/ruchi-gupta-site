export function ImagePlaceholder({
  className = "",
  aspectClass = "aspect-square",
}: {
  className?: string;
  aspectClass?: string;
}) {
  return (
    <div
      data-placeholder
      className={`flex w-full items-center justify-center bg-fill text-sm leading-prose text-text-secondary ${aspectClass} ${className}`}
      aria-hidden
    >
      <span className="opacity-70">Image Placeholder</span>
    </div>
  );
}
