-- Luundy Mahjong Table Database Schema
-- Run this in Supabase SQL Editor to create all required tables

-- ============================================
-- 1. Products Table (产品表)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  short_desc TEXT,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  category_name VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10, 2),
  color VARCHAR(50),
  features JSONB DEFAULT '[]',
  options JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  url VARCHAR(500),
  badges JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. Categories Table (分类表)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  en_description TEXT,
  product_slugs JSONB DEFAULT '[]',
  image_url VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. Users Table (用户表 - 扩展 auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255),
  display_name VARCHAR(100),
  phone VARCHAR(50),
  avatar_url VARCHAR(500),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. Addresses Table (收货地址表)
-- ============================================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  street_address VARCHAR(500) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'USA',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. Orders Table (订单表)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Customer Info
  customer_name VARCHAR(100),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  
  -- Shipping Address
  shipping_name VARCHAR(100),
  shipping_phone VARCHAR(50),
  shipping_street VARCHAR(500),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(50),
  shipping_zip VARCHAR(20),
  shipping_country VARCHAR(50) DEFAULT 'USA',
  
  -- Order Items (JSON for simplicity)
  items JSONB DEFAULT '[]',
  subtotal DECIMAL(10, 2) DEFAULT 0,
  shipping_fee DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) DEFAULT 0,
  
  -- Configuration (selected options)
  configuration JSONB DEFAULT '{}',
  product_slug VARCHAR(255),
  final_price DECIMAL(10, 2),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'processing', 'shipped', 'delivered', 
    'cancelled', 'refunded'
  )),
  
  -- Payment
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'paid', 'failed', 'refunded'
  )),
  payment_id VARCHAR(255),
  
  -- Notes
  notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. Order Status History (订单状态历史)
-- ============================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(50) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- 7. Coupons Table (优惠券表)
-- ============================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  description TEXT,
  discount_type VARCHAR(20) CHECK (discount_type IN ('fixed', 'percentage')),
  discount_value DECIMAL(10, 2) DEFAULT 0,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  applicable_products JSONB DEFAULT '[]',
  applicable_categories JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. Reviews Table (评价表)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_slug VARCHAR(255),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  images JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes (索引)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Addresses: Users can only manage their own addresses
CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Reviews: Users can manage their own reviews
CREATE POLICY "Users can view reviews" ON reviews
  FOR SELECT USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Products & Categories: Public read for everyone
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

-- Admin policies (handle in API layer for now)
-- In production, create an admin role and add proper admin policies

-- ============================================
-- Functions & Triggers
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'LUY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
    LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 14) AS INTEGER)), 0) + 1 
          FROM orders WHERE order_number LIKE 'LUY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%'), 6, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================
-- Initial Data: Categories
-- ============================================
INSERT INTO categories (slug, name, description, en_description, sort_order) VALUES
  ('folding-4mouth', '折叠款四口机', '四口经典结构，轻松折叠收纳', 'Four-port classic structure, easy folding storage', 1),
  ('folding-rotary', '折叠款旋翼机', '最新无柱旋翼机芯，一盘无需推牌', 'Latest pillar-free rotary mechanism, no tile pushing needed', 2),
  ('table-4mouth', '餐桌款四口机', '餐桌麻将两用，家具家电首选', 'Dining table and mahjong combo, perfect for home', 3),
  ('table-rotary', '餐桌款旋翼机', '轻薄机身，餐桌实用兼顾', 'Slim design, practical dining table兼顾', 4),
  ('outdoor', '户外麻将机', '轻便小巧，随时随地享受麻将乐趣', 'Lightweight and portable, enjoy mahjong anywhere', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Storage Buckets (run in Supabase Dashboard)
-- ============================================
-- Go to Storage in Supabase Dashboard and create:
-- 1. 'product-images' bucket (public)
-- 2. 'avatars' bucket (public)
-- 3. 'review-images' bucket (public)
