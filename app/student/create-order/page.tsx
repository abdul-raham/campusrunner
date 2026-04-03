'use client';

import { Suspense } from 'react';
import { CreateOrderForm } from '@/components/student/CreateOrderForm';
import PageLoader from '@/components/PageLoader';

export default function CreateOrderPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CreateOrderForm />
    </Suspense>
  );
}
