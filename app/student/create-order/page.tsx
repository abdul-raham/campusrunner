'use client';

import { Suspense } from 'react';
import { CreateOrderForm } from '@/components/student/CreateOrderForm';

function CreateOrderContent() {
  return <CreateOrderForm />;
}

export default function CreateOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5FF] via-white to-[#F0F9FF] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 rounded-full border-2 border-[#E5E7EB] border-t-[#6200EE] animate-spin" />
          </div>
        }>
          <CreateOrderContent />
        </Suspense>
      </div>
    </div>
  );
}
