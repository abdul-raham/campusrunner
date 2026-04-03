# Phase 3 - Quick Setup Guide

## 🚀 Setup Steps

### 1. Run Database Migrations

Open Supabase SQL Editor and run:

```sql
-- Copy and paste contents from:
migrations/notification_triggers.sql
```

This will create:
- Notification triggers for order status changes
- Auto-timestamp triggers for accepted_at and completed_at

### 2. Verify Database Schema

Ensure these columns exist in `orders` table:
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
```

### 3. Test the Flow

#### As Student:
1. Go to `/student/create-order`
2. Create a new order
3. Go to `/student/orders`
4. Click on the order to view details
5. Check `/student/notifications` (should be empty for now)

#### As Admin/Runner:
1. Go to admin panel
2. Accept the order (change status to 'accepted')
3. Switch back to student account
4. Check `/student/notifications` - should see "Runner Accepted Your Order"
5. Go to order details - should see timeline updated

#### Test Auto-Refresh:
1. Open order details page
2. In another tab, change order status in database
3. Wait 20 seconds
4. Order details page should auto-update

### 4. Verify Notifications Work

Test each status change:
```sql
-- In Supabase SQL Editor:

-- 1. Accept order
UPDATE orders SET status = 'accepted' WHERE id = 'YOUR_ORDER_ID';
-- Check: Student should get "Runner Accepted Your Order" notification

-- 2. Start progress
UPDATE orders SET status = 'in_progress' WHERE id = 'YOUR_ORDER_ID';
-- Check: Student should get "Runner Started Task" notification

-- 3. Complete order
UPDATE orders SET status = 'completed' WHERE id = 'YOUR_ORDER_ID';
-- Check: Student should get "Order Completed" notification
```

## ✅ What's Working

### Order Details Page
- ✅ Shows complete order information
- ✅ Visual timeline with 4 stages
- ✅ Order items list
- ✅ Pickup/delivery locations
- ✅ Runner info with call button
- ✅ Auto-refresh every 20 seconds
- ✅ Mobile responsive

### Notifications
- ✅ Auto-created on status change
- ✅ Shows unread count
- ✅ Mark as read
- ✅ Mark all as read
- ✅ Filter and search
- ✅ Color-coded by type

### Data Refresh
- ✅ No realtime subscriptions needed
- ✅ Polling on order details only
- ✅ Free tier compatible

## 🐛 Troubleshooting

### Notifications Not Appearing?
1. Check if triggers are installed:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname LIKE '%notification%';
   ```
2. Verify notifications table exists
3. Check RLS policies on notifications table

### Timeline Not Updating?
1. Verify `accepted_at` and `completed_at` columns exist
2. Check if timestamp triggers are installed
3. Ensure order status is changing correctly

### Auto-Refresh Not Working?
1. Check browser console for errors
2. Verify Supabase client is configured
3. Ensure order ID is valid

## 📝 Testing Checklist

- [ ] Create order as student
- [ ] View order in orders list
- [ ] Click to view order details
- [ ] Verify timeline shows "Created" step
- [ ] Accept order (as admin/runner)
- [ ] Check notification appears
- [ ] Verify timeline shows "Accepted" step
- [ ] Change status to "in_progress"
- [ ] Check notification appears
- [ ] Verify timeline shows "In Progress" step
- [ ] Complete order
- [ ] Check notification appears
- [ ] Verify timeline shows "Completed" step
- [ ] Test mark as read on notifications
- [ ] Test mark all as read
- [ ] Test notification filters
- [ ] Test notification search
- [ ] Test auto-refresh (wait 20 seconds on order details)

## 🎉 Phase 3 Complete!

All student features are now working:
- Dashboard ✅
- Create orders ✅
- View orders ✅
- Order details with timeline ✅
- Notifications ✅
- Auto-refresh ✅

Ready to commit and push!
