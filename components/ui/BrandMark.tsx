export function BrandMark({ size = 36, gold = false }: { size?: number; gold?: boolean }) {
  return (
    <div
      className="flex items-center justify-center font-display font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: gold
          ? 'linear-gradient(135deg, #F5A623, #e8830a)'
          : 'linear-gradient(135deg, #2D7EFF, #7B61FF)',
        boxShadow: gold
          ? '0 4px 12px rgba(245,166,35,0.4)'
          : '0 4px 12px rgba(45,126,255,0.4)',
        borderRadius: Math.round(size * 0.27),
      }}
    >
      CR
    </div>
  );
}
