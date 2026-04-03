'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export function MobileNavbar({ userRole, userName }: { userRole: string; userName: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6200EE] to-[#03DAC5] p-0.5">
            <div className="w-full h-full rounded-lg bg-white flex items-center justify-center">
              <Image src="/logo.png" alt="CampusRunner" width={20} height={20} className="rounded-md" />
            </div>
          </div>
          <span className="font-bold text-gray-900">CampusRunner</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
