'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/supabase/client';
import { ArrowRight, Plus, Trash2, CheckCircle2, AlertCircle, MapPin, DollarSign, FileText } from 'lucide-react';

const serviceNames: Record<string, string> = {
  gas_refill: 'Gas Refill',
  market_run: 'Market Run',
  laundry_pickup: 'Laundry',
  printing_photocopy: 'Printing',
  food_pickup: 'Food Pickup',
  parcel_delivery: 'Parcel Delivery',
  pharmacy_essentials: 'Pharmacy',
  errand_assistant: 'Errand Assistant',
};

export function CreateOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service') || '';
  const serviceName = serviceNames[serviceId] || 'Service';

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    items: [{ name: '', quantity: 1 }],
    budget: '',
    pickupLocation: '',
    deliveryLocation: '',
    urgency: 'normal',
    notes: '',
  });

  const steps = [
    { num: 1, title: 'Order Details', fields: ['title', 'description'] },
    { num: 2, title: 'Items', fields: ['items'] },
    { num: 3, title: 'Budget & Locations', fields: ['budget', 'pickupLocation', 'deliveryLocation'] },
    { num: 4, title: 'Review', fields: [] },
  ];

  const currentStepData = steps[currentStep - 1];
  const isStepComplete = currentStep === 4 || (
    currentStepData.fields.length > 0 && 
    currentStepData.fields.every(field => {
      if (field === 'items') {
        return formData.items.some(item => item.name.trim());
      }
      return formData[field as keyof typeof formData];
    })
  );

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1 }],
    });
  };

  const removeItem = (idx: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== idx),
    });
  };

  const updateItem = (idx: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < 4) {
      if (isStepComplete) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('Creating order with service:', serviceId, serviceName);

      // Get service category ID - try multiple methods
      let serviceData;
      
      // First try by slug
      const { data: slugData, error: slugError } = await supabase
        .from('service_categories')
        .select('id')
        .eq('slug', serviceId)
        .maybeSingle();
      
      console.log('Slug lookup:', { slugData, slugError });
      
      if (slugData) {
        serviceData = slugData;
      } else {
        // Try by name match
        const { data: nameData, error: nameError } = await supabase
          .from('service_categories')
          .select('id')
          .ilike('name', `%${serviceName}%`)
          .maybeSingle();
        
        console.log('Name lookup:', { nameData, nameError });
        
        if (nameData) {
          serviceData = nameData;
        } else {
          // If still not found, just use the first service category
          const { data: firstService, error: firstError } = await supabase
            .from('service_categories')
            .select('id')
            .limit(1)
            .single();
          
          console.log('First service lookup:', { firstService, firstError });
          serviceData = firstService;
        }
      }

      if (!serviceData) {
        throw new Error('No service categories available. Please add services in admin panel.');
      }

      console.log('Using service category:', serviceData);

      // Create order
      const orderPayload = {
        student_id: user.id,
        service_category_id: serviceData.id,
        title: formData.title,
        description: formData.description,
        budget_amount: parseFloat(formData.budget),
        final_amount: parseFloat(formData.budget),
        pickup_location: formData.pickupLocation,
        delivery_location: formData.deliveryLocation,
        urgency_level: formData.urgency,
        status: 'pending',
      };

      console.log('Order payload:', orderPayload);

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      console.log('Order created:', orderData);

      // Add order items
      const itemsToInsert = formData.items
        .filter(item => item.name.trim())
        .map(item => ({
          order_id: orderData.id,
          item_name: item.name,
          quantity: item.quantity,
        }));

      if (itemsToInsert.length > 0) {
        console.log('Inserting items:', itemsToInsert);
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsToInsert);

        if (itemsError) {
          console.error('Items error:', itemsError);
          throw new Error(`Failed to add items: ${itemsError.message}`);
        }
      }

      // Add notes to order_meta if provided
      if (formData.notes && formData.notes.trim()) {
        console.log('Adding notes to order_meta');
        const { error: metaError } = await supabase
          .from('order_meta')
          .insert([{
            order_id: orderData.id,
            key: 'notes',
            value: formData.notes,
          }]);

        if (metaError) {
          console.error('Meta error:', metaError);
          // Don't throw error for notes, just log it
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/student/orders/${orderData.id}`);
      }, 2000);
    } catch (err) {
      console.error('Full error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating your order';
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 rounded-3xl border-3 border-[#6200EE]/40 bg-white/95 backdrop-blur p-8 shadow-xl"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <div>
          <h2 className="text-3xl font-black text-[#0B0E11] mb-2">Order Created!</h2>
          <p className="text-[#6B7280]">Your {serviceName} order has been posted</p>
          <p className="text-sm text-[#9CA3AF] mt-2">Redirecting to order details...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 rounded-3xl border-3 border-[#6200EE]/40 bg-white/95 backdrop-blur p-8 shadow-xl"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black bg-gradient-to-r from-[#6200EE] to-[#03DAC5] bg-clip-text text-transparent">
          Create {serviceName} Order
        </h1>
        <p className="text-sm text-[#6B7280]">Step {currentStep} of 4</p>
      </div>

      {/* Progress */}
      <div className="flex justify-between items-center gap-2">
        {steps.map((step, idx) => (
          <motion.div key={step.num} className="flex-1 flex items-center gap-2">
            <motion.div
              animate={{
                scale: currentStep >= step.num ? 1 : 0.8,
                backgroundColor: currentStep >= step.num ? '#6200EE' : '#E5E7EB',
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            >
              {currentStep > step.num ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <span className={currentStep >= step.num ? 'text-white' : 'text-[#6B7280]'}>
                  {step.num}
                </span>
              )}
            </motion.div>
            {idx < steps.length - 1 && (
              <motion.div
                animate={{
                  backgroundColor: currentStep > step.num ? '#6200EE' : '#E5E7EB',
                }}
                className="flex-1 h-1 rounded-full"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-200/50 bg-red-50/80 backdrop-blur p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-5">
          {/* Step 1: Order Details */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6200EE]" />
                  Order Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Buy groceries for the week"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11]">Description</label>
                <textarea
                  placeholder="Add any additional details about your order..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF] resize-none"
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Step 2: Items */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {formData.items.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    className="flex-1 rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value))}
                    className="w-20 rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="w-full rounded-xl border-2 border-dashed border-[#6200EE]/50 bg-[#6200EE]/5 py-2 px-3 text-sm font-bold text-[#6200EE] hover:bg-[#6200EE]/10 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
          )}

          {/* Step 3: Budget & Locations */}
          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#6200EE]" />
                  Budget (₦)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6200EE]" />
                  Pickup Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Lekki Market"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6200EE]" />
                  Delivery Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Campus Hostel A"
                  value={formData.deliveryLocation}
                  onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11]">Urgency</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11]">Additional Notes</label>
                <textarea
                  placeholder="Any special instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF] resize-none"
                  rows={2}
                />
              </div>
            </>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4 rounded-2xl bg-[#F8F5FF] p-6">
              <div>
                <p className="text-xs text-[#6B7280] font-bold uppercase">Service</p>
                <p className="text-lg font-bold text-[#0B0E11]">{serviceName}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-bold uppercase">Title</p>
                <p className="text-lg font-bold text-[#0B0E11]">{formData.title}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-bold uppercase">Items</p>
                <div className="space-y-1">
                  {formData.items.map((item, idx) => (
                    item.name && (
                      <p key={idx} className="text-sm text-[#0B0E11]">
                        • {item.name} (x{item.quantity})
                      </p>
                    )
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#6B7280] font-bold uppercase">Budget</p>
                  <p className="text-lg font-bold text-[#6200EE]">₦{formData.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] font-bold uppercase">Urgency</p>
                  <p className="text-lg font-bold text-[#0B0E11] capitalize">{formData.urgency}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-bold uppercase">From</p>
                <p className="text-sm text-[#0B0E11]">{formData.pickupLocation}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-bold uppercase">To</p>
                <p className="text-sm text-[#0B0E11]">{formData.deliveryLocation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          {currentStep > 1 && (
            <motion.button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-xl border-2 border-[#E5E7EB] bg-white py-2 font-bold text-sm text-[#6200EE] transition-all hover:border-[#6200EE] hover:bg-[#F8F5FF]"
            >
              Back
            </motion.button>
          )}

          <motion.button
            type="submit"
            disabled={loading || !isStepComplete}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#6200EE] to-[#03DAC5] py-2 font-bold text-sm text-white shadow-lg shadow-[#6200EE]/20 transition-all hover:shadow-[#6200EE]/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                {currentStep === 4 ? 'Create Order' : 'Next'}
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
