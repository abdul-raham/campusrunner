import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <div className={cn('flex items-center justify-center bg-white shadow-lg', className)}>
      <Image 
        src="/logo.svg" 
        alt="CampusRunner" 
        width={32} 
        height={32} 
        className="rounded-lg"
      />
    </div>
  );
}