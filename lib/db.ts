// Local JSON Database Manager
// This module handles all database operations using local JSON files

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

// Types
export type User = {
  id: string;
  email: string;
  password: string;
  displayName: string;
  phone?: string;
  isAdmin: boolean;
  createdAt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  category: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  color: string;
  features: string[];
  options: Record<string, string[]>;
  images: string[];
  badges: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingName: string;
  shippingPhone: string;
  shippingStreet: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  items: any[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  configuration: Record<string, string>;
  productSlug: string;
  productName: string;
  finalPrice: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Address = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  street: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
};

type Database = {
  users: User[];
  products: Product[];
  orders: Order[];
  addresses: Address[];
};

// Alias for backward compatibility
export const getDatabase = readDatabase;

// Read database
async function readDatabase(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty structure
    return { users: [], products: [], orders: [], addresses: [] };
  }
}

// Write database
async function writeDatabase(db: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// Generate unique ID
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

// Generate order number
export function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LUY-${date}-${random}`;
}

// Hash password (simple hash for demo - use bcrypt in production)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Verify password (plain text comparison for simplicity)
export function verifyPassword(password: string, storedPassword: string): boolean {
  return password === storedPassword;
}

// ==================== USER OPERATIONS ====================

export async function getUserById(id: string): Promise<User | null> {
  const db = await readDatabase();
  return db.users.find(u => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await readDatabase();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(data: {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
}): Promise<User> {
  const db = await readDatabase();
  
  // Check if email already exists
  if (db.users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('Email already exists');
  }
  
  const user: User = {
    id: generateId('user'),
    email: data.email,
    password: hashPassword(data.password),
    displayName: data.displayName,
    phone: data.phone,
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };
  
  db.users.push(user);
  await writeDatabase(db);
  
  // Return without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const db = await readDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user && verifyPassword(password, user.password)) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  return null;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const db = await readDatabase();
  const index = db.users.findIndex(u => u.id === id);
  
  if (index === -1) return null;
  
  // Don't allow password changes through this function
  delete data.password;
  delete data.id;
  delete data.isAdmin;
  
  db.users[index] = { ...db.users[index], ...data };
  await writeDatabase(db);
  
  const { password: _, ...userWithoutPassword } = db.users[index];
  return userWithoutPassword as User;
}

// ==================== PRODUCT OPERATIONS ====================

export async function getAllProducts(): Promise<Product[]> {
  const db = await readDatabase();
  return db.products.filter(p => p.isActive).sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await readDatabase();
  return db.products.find(p => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await readDatabase();
  return db.products.find(p => p.id === id) || null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const db = await readDatabase();
  return db.products
    .filter(p => p.category === category && p.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const db = await readDatabase();
  
  // Check if slug already exists
  if (db.products.some(p => p.slug === data.slug)) {
    throw new Error('Product slug already exists');
  }
  
  const product: Product = {
    ...data,
    id: generateId('prod'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  db.products.push(product);
  await writeDatabase(db);
  
  return product;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const db = await readDatabase();
  const index = db.products.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  delete data.id;
  delete data.createdAt;
  
  db.products[index] = {
    ...db.products[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  await writeDatabase(db);
  return db.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await readDatabase();
  const index = db.products.findIndex(p => p.id === id);
  
  if (index === -1) return false;
  
  // Soft delete - just set isActive to false
  db.products[index].isActive = false;
  db.products[index].updatedAt = new Date().toISOString();
  
  await writeDatabase(db);
  return true;
}

// ==================== ORDER OPERATIONS ====================

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await readDatabase();
  return db.orders.find(o => o.id === id) || null;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const db = await readDatabase();
  return db.orders.find(o => o.orderNumber === orderNumber) || null;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const db = await readDatabase();
  return db.orders
    .filter(o => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await readDatabase();
  return db.orders.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createOrder(data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const db = await readDatabase();
  
  const order: Order = {
    ...data,
    id: generateId('order'),
    orderNumber: generateOrderNumber(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  db.orders.push(order);
  await writeDatabase(db);
  
  return order;
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<Order | null> {
  const db = await readDatabase();
  const index = db.orders.findIndex(o => o.id === id);
  
  if (index === -1) return null;
  
  delete data.id;
  delete data.orderNumber;
  delete data.createdAt;
  
  db.orders[index] = {
    ...db.orders[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  await writeDatabase(db);
  return db.orders[index];
}

// ==================== ADDRESS OPERATIONS ====================

export async function getAddressesByUserId(userId: string): Promise<Address[]> {
  const db = await readDatabase();
  return db.addresses.filter(a => a.userId === userId);
}

export async function getDefaultAddress(userId: string): Promise<Address | null> {
  const db = await readDatabase();
  return db.addresses.find(a => a.userId === userId && a.isDefault) || null;
}

export async function createAddress(data: Omit<Address, 'id' | 'createdAt'>): Promise<Address> {
  const db = await readDatabase();
  
  // If this is set as default, unset other defaults
  if (data.isDefault) {
    db.addresses.forEach(a => {
      if (a.userId === data.userId) a.isDefault = false;
    });
  }
  
  const address: Address = {
    ...data,
    id: generateId('addr'),
    createdAt: new Date().toISOString(),
  };
  
  db.addresses.push(address);
  await writeDatabase(db);
  
  return address;
}

export async function updateAddress(id: string, data: Partial<Address>): Promise<Address | null> {
  const db = await readDatabase();
  const index = db.addresses.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  // If this is set as default, unset other defaults
  if (data.isDefault) {
    db.addresses.forEach(a => {
      if (a.userId === db.addresses[index].userId) a.isDefault = false;
    });
  }
  
  delete data.id;
  delete data.createdAt;
  
  db.addresses[index] = { ...db.addresses[index], ...data };
  await writeDatabase(db);
  
  return db.addresses[index];
}

export async function deleteAddress(id: string): Promise<boolean> {
  const db = await readDatabase();
  const index = db.addresses.findIndex(a => a.id === id);
  
  if (index === -1) return false;
  
  db.addresses.splice(index, 1);
  await writeDatabase(db);
  
  return true;
}
