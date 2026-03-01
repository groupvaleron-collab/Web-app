-- =============================================
-- CARZ Vehicle Import Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NULL, -- Nullable for Google users
    google_id VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    address TEXT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL -- Soft delete
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- =============================================
-- 2. VEHICLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    description TEXT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'ordered', 'sold')),
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'LKR',
    mileage INTEGER NULL,
    transmission VARCHAR(50) NULL,
    fuel_type VARCHAR(50) NULL,
    engine_capacity VARCHAR(50) NULL,
    color VARCHAR(50) NULL,
    grade VARCHAR(10) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand);

-- =============================================
-- 3. VEHICLE IMAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS vehicle_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(20) DEFAULT 'general' CHECK (image_type IN ('general', 'special')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);

-- =============================================
-- 4. STAGES MASTER TABLE (For scalability)
-- =============================================
CREATE TABLE IF NOT EXISTS stages_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_name VARCHAR(100) NOT NULL,
    stage_order INTEGER NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default stages
INSERT INTO stages_master (stage_name, stage_order, description) VALUES
    ('Requirement Identification', 1, 'Identify customer requirements and preferences'),
    ('Estimate Price & Advance Payment', 2, 'Calculate estimated price and collect advance payment'),
    ('Auction Bidding & Purchasing', 3, 'Participate in auction and purchase vehicle'),
    ('Open LC', 4, 'Open Letter of Credit for payment'),
    ('Balance Paid', 5, 'Complete balance payment'),
    ('Arrange Shipment', 6, 'Arrange shipping logistics'),
    ('Shipped', 7, 'Vehicle shipped from origin'),
    ('Shipping & Arrived', 8, 'Vehicle arrived at destination port'),
    ('Custom Clearance', 9, 'Complete customs clearance process'),
    ('Vehicle Delivery', 10, 'Vehicle delivered to customer')
ON CONFLICT DO NOTHING;

-- =============================================
-- 5. ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id UUID NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    vehicle_name VARCHAR(255) NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    advance_amount DECIMAL(15, 2) DEFAULT 0,
    balance_amount DECIMAL(15, 2) DEFAULT 0,
    current_stage_id UUID NULL REFERENCES stages_master(id),
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_vehicle_id ON orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_orders_referral_code ON orders(referral_code);

-- =============================================
-- 6. ORDER STAGES TABLE (Dynamic stages per order)
-- =============================================
CREATE TABLE IF NOT EXISTS order_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES stages_master(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    completed_date TIMESTAMP WITH TIME ZONE NULL,
    estimated_date TIMESTAMP WITH TIME ZONE NULL,
    notes TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_stages_order_id ON order_stages(order_id);
CREATE INDEX IF NOT EXISTS idx_order_stages_stage_id ON order_stages(stage_id);

-- =============================================
-- 7. EXPENSES TABLE (Track expenses/payments per order)
-- Categories: Advance, LC, LC Commission, Clearing + Logistic, TAX, Damage
-- =============================================
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_stage_id UUID NULL REFERENCES order_stages(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Advance', 'LC', 'LC Commission', 'Clearing + Logistic', 'TAX', 'Damage')),
    description TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'LKR',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_order_id ON expenses(order_id);
CREATE INDEX IF NOT EXISTS idx_expenses_order_stage_id ON expenses(order_stage_id);

-- =============================================
-- 8. PAYMENTS TABLE (Track payments per order/stage)
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_stage_id UUID NULL REFERENCES order_stages(id) ON DELETE SET NULL,
    payment_type VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'LKR',
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_stage_id ON payments(order_stage_id);

-- =============================================
-- 9. REFERRALS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    reward_amount DECIMAL(15, 2) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_user_id ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral_code ON referrals(referral_code);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_stages_updated_at BEFORE UPDATE ON order_stages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS VARCHAR(20) AS $$
DECLARE
    chars VARCHAR(36) := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result VARCHAR(20) := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN 'CARZ-' || result;
END;
$$ LANGUAGE plpgsql;

-- Function to create order stages when order is created
CREATE OR REPLACE FUNCTION create_order_stages()
RETURNS TRIGGER AS $$
DECLARE
    stage RECORD;
BEGIN
    -- Insert all stages for the new order
    FOR stage IN SELECT id FROM stages_master ORDER BY stage_order LOOP
        INSERT INTO order_stages (order_id, stage_id, status)
        VALUES (NEW.id, stage.id, 'pending');
    END LOOP;
    
    -- Set current_stage_id to first stage
    UPDATE orders SET current_stage_id = (
        SELECT id FROM stages_master ORDER BY stage_order LIMIT 1
    ) WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_order_insert
    AFTER INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION create_order_stages();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages_master ENABLE ROW LEVEL SECURITY;

-- Public read access for vehicles and stages_master
CREATE POLICY "Public read access for vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Public read access for vehicle_images" ON vehicle_images FOR SELECT USING (true);
CREATE POLICY "Public read access for stages_master" ON stages_master FOR SELECT USING (true);

-- Allow insert for authenticated users (handled via API)
CREATE POLICY "Allow all for users table via API" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for orders table via API" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all for order_stages table via API" ON order_stages FOR ALL USING (true);
CREATE POLICY "Allow all for expenses table via API" ON expenses FOR ALL USING (true);
CREATE POLICY "Allow all for payments table via API" ON payments FOR ALL USING (true);
CREATE POLICY "Allow all for referrals table via API" ON referrals FOR ALL USING (true);
CREATE POLICY "Allow all for vehicles table via API" ON vehicles FOR ALL USING (true);
CREATE POLICY "Allow all for vehicle_images table via API" ON vehicle_images FOR ALL USING (true);

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert admin user
-- INSERT INTO users (name, email, role) VALUES ('Admin', 'groupvaleron@gmail.com', 'admin');
