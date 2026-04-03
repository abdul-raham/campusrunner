'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase';

interface OrderTrackingProps {
  orderId: string
}

interface OrderStatus {
  status: string
  updated_at: string
}

export default function OrderTracking({ orderId }: OrderTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState<string>('pending')
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    fetchOrderStatus()
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `id=eq.${orderId}`
        }, 
        (payload) => {
          setCurrentStatus(payload.new.status)
          setLastUpdated(payload.new.updated_at)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [orderId])

  const fetchOrderStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status, updated_at')
        .eq('id', orderId)
        .single()

      if (error) throw error
      
      setCurrentStatus(data.status)
      setLastUpdated(data.updated_at)
    } catch (error) {
      console.error('Error fetching order status:', error)
    }
  }

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: '📝' },
    { key: 'accepted', label: 'Runner Assigned', icon: '👤' },
    { key: 'in_progress', label: 'In Progress', icon: '🚀' },
    { key: 'completed', label: 'Completed', icon: '✅' }
  ]

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === currentStatus)
  }

  const currentStepIndex = getCurrentStepIndex()

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Order Status</h3>
      
      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex
          const isCurrent = index === currentStepIndex
          
          return (
            <div key={step.key} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                isCompleted 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step.icon}
              </div>
              
              <div className="flex-1">
                <p className={`font-medium ${
                  isCompleted ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
                {isCurrent && lastUpdated && (
                  <p className="text-sm text-gray-500">
                    Updated: {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
              
              {isCompleted && (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {currentStatus === 'cancelled' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">❌ Order Cancelled</p>
        </div>
      )}
    </div>
  )
}
