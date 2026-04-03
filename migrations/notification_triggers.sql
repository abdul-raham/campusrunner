-- Notification Triggers for Order Status Changes
-- Run this in Supabase SQL Editor

-- Function to create notification
CREATE OR REPLACE FUNCTION create_order_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- When order is accepted
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    INSERT INTO notifications (user_id, title, message, type, related_order_id)
    VALUES (
      NEW.student_id,
      'Runner Accepted Your Order',
      'Your order "' || NEW.title || '" has been accepted by a runner and will be processed soon.',
      'order_update',
      NEW.id
    );
  END IF;

  -- When order is in progress
  IF NEW.status = 'in_progress' AND OLD.status = 'accepted' THEN
    INSERT INTO notifications (user_id, title, message, type, related_order_id)
    VALUES (
      NEW.student_id,
      'Runner Started Task',
      'Your order "' || NEW.title || '" is now in progress. The runner is working on it.',
      'order_update',
      NEW.id
    );
  END IF;

  -- When order is completed
  IF NEW.status = 'completed' AND OLD.status = 'in_progress' THEN
    INSERT INTO notifications (user_id, title, message, type, related_order_id)
    VALUES (
      NEW.student_id,
      'Order Completed',
      'Your order "' || NEW.title || '" has been completed successfully!',
      'order_update',
      NEW.id
    );
  END IF;

  -- When order is cancelled
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    INSERT INTO notifications (user_id, title, message, type, related_order_id)
    VALUES (
      NEW.student_id,
      'Order Cancelled',
      'Your order "' || NEW.title || '" has been cancelled.',
      'order_update',
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS order_status_notification_trigger ON orders;
CREATE TRIGGER order_status_notification_trigger
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_order_notification();

-- Add accepted_at timestamp trigger
CREATE OR REPLACE FUNCTION update_accepted_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' AND NEW.accepted_at IS NULL THEN
    NEW.accepted_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_accepted_at_trigger ON orders;
CREATE TRIGGER set_accepted_at_trigger
  BEFORE UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_accepted_at();

-- Add completed_at timestamp trigger
CREATE OR REPLACE FUNCTION update_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.completed_at IS NULL THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_completed_at_trigger ON orders;
CREATE TRIGGER set_completed_at_trigger
  BEFORE UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_completed_at();
