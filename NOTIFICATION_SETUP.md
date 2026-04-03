# 📬 Notification System Setup

## Quick Overview
This sets up **automatic notifications** that trigger whenever:
- ✅ An order status changes (accepted → in progress → completed)
- ✅ A runner is assigned to your order
- ✅ Order timestamps are updated

---

## How to Set It Up (3 Simple Steps)

### Step 1️⃣: Run the SQL Code

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Click your project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Open the file: `notification-triggers.sql`
6. Copy ALL the code and paste it into the SQL Editor
7. Press **Run** (or Ctrl+Enter)

**That's it!** The database will automatically set up notifications.

---

## What Gets Created

| What | What It Does |
|------|-------------|
| **Order Status Triggers** | When order changes status (accepted/in-progress/completed/cancelled), a notification is sent |
| **Runner Assignment Trigger** | When a runner is assigned to your order, you get notified |
| **Timestamp Updates** | Automatically records when order was accepted/completed |
| **Database Index** | Makes notification loading faster |
---

## Step 2️⃣: Verify It Worked

After running the SQL, go back to SQL Editor and run this to check:

```sql
SELECT COUNT(*) as trigger_count 
FROM information_schema.triggers 
WHERE trigger_name LIKE '%notification%' OR trigger_name LIKE '%timestamp%';
```

✅ **If you see a number ≥ 2**, it worked!

---

## Step 3️⃣: Test It

1. Go to your student dashboard
2. Create a test order
3. Go to Supabase → Orders table
4. Find your order and change the status to `accepted`
5. Go back to app and refresh
6. **You should see a notification!** 🎉

---

## Step 4️⃣: Check Your Frontend

Look for the bell icon (🔔) with a **red badge** showing unread count:
- It's in the top navigation bar
- Click it to see all notifications
- The badge auto-updates when new notifications arrive

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| Notifications don't appear after SQL runs | Check Supabase logs for errors. Make sure RLS policies allow INSERT on notifications table |
| Bell badge doesn't show count | Refresh page. Check browser console for errors |
| SQL won't run | Make sure you copied the ENTIRE file and you're in SQL Editor (not Data Editor) |
| Notifications not being created | Verify triggers installed (see Step 2). Check if order updates are actually happening |

---

## 📚 What Files Are Involved?

- **Database**: `notification-triggers.sql` - Creates automatic triggers
- **Frontend**: `NotificationBadge.tsx` - Shows unread count
- **Pages**: `/student/notifications` - Displays all notifications

**That's all you need!** The system handles the rest automatically. ✨
