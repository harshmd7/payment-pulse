-- Add UPI ID column to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS upi_id TEXT;

-- Create payments table to track all incoming payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  upi_transaction_id TEXT UNIQUE NOT NULL,
  upi_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'completed',
  transaction_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_upi_id ON payments(upi_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date DESC);

-- Create payment_reconciliation table to track auto-reconciliation
CREATE TABLE IF NOT EXISTS payment_reconciliation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  matched_amount DECIMAL(10, 2) NOT NULL,
  reconciliation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  auto_matched BOOLEAN DEFAULT TRUE,
  notes TEXT
);

-- Create trigger to update customer outstanding amount when payment is added
CREATE OR REPLACE FUNCTION update_customer_outstanding()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers
  SET 
    outstanding_amount = GREATEST(0, outstanding_amount - NEW.amount),
    updated_at = NOW()
  WHERE id = NEW.customer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_outstanding
AFTER INSERT ON payments
FOR EACH ROW
EXECUTE FUNCTION update_customer_outstanding();

-- Create view for customer payment summary
CREATE OR REPLACE VIEW customer_payment_summary AS
SELECT 
  c.id,
  c.name,
  c.email,
  c.phone,
  c.upi_id,
  c.outstanding_amount as current_outstanding,
  c.days_overdue,
  COALESCE(SUM(p.amount), 0) as total_paid,
  COUNT(p.id) as payment_count,
  MAX(p.payment_date) as last_payment_date
FROM customers c
LEFT JOIN payments p ON c.id = p.customer_id
GROUP BY c.id, c.name, c.email, c.phone, c.upi_id, c.outstanding_amount, c.days_overdue;
