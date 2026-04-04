'use client';

import { Suspense } from 'react';
import { CreateOrderForm } from '@/components/student/CreateOrderForm';
import PageLoader from '@/components/PageLoader';

export default function CreateOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5FF] via-white to-[#F0F9FF] py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={<PageLoader />}>
          <CreateOrderForm />
        </Suspense>
      </div>
    </div>
  );
}
