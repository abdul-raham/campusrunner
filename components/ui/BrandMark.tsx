import Image from 'next/image';

export function BrandMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <div className={`${className} relative rounded-2xl overflow-hidden`}>
      <Image 
        src="/logo.png" 
        alt="CampusRunner" 
        fill
        className="object-contain"
      />
    </div>
  );
}
