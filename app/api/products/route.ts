// Products API Route
// GET /api/products - List all products
// POST /api/products - Create new product (admin)
// PUT /api/products - Update product (admin)
// DELETE /api/products - Delete product (admin)

import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { products as catalogProducts } from '@/lib/products';

async function getMergedProducts() {
  const databaseProducts = await db.getAllProducts();
  const catalogSlugs = new Set(catalogProducts.map((product) => product.slug));
  const importedProducts = catalogProducts.map((product) => {
    const shippingMethods = (product.options?.shipping ?? [])
      .map((s) => s.code)
      .filter((c): c is db.ShippingMethodCode => c === 'pickup' || c === 'fedex' || c === 'sea');
    return {
      id: `catalog_${product.slug}`,
      slug: product.slug,
      name: product.name,
      shortDesc: product.shortDesc,
      description: product.description,
      category: product.category,
      categoryName: product.categoryName,
      price: product.price,
      originalPrice: product.original,
      color: product.color,
      features: product.features.map((feature) => `${feature.title}：${feature.desc}`),
      options: product.options,
      images: product.images,
      badges: product.badges ?? [],
      isActive: true,
      isFeatured: false,
      bodyColors: (product.options?.body_color ?? []).map((c) => ({
        name: c.name ?? c.label ?? c.code,
        value: c.code,
      })),
      tableColors: (product.options?.table_color ?? []).map((c) => ({
        name: c.name ?? c.label ?? c.code,
        value: c.code,
      })),
      tileSizes: (product.options?.tile_size ?? []).map((s) => s.label ?? `${s.code}号`),
      tileCounts: (product.options?.tile_count ?? []).map((s) => s.code),
      tileColorOptions: (product.options?.tile_color ?? []).map((c) => ({
        name: c.name ?? c.label ?? c.code,
        image: c.image ?? '',
        description: c.desc ?? '',
      })),
      legModels: (product.options?.leg_type ?? []).map((c) => ({
        name: c.name ?? c.label ?? c.code,
        image: c.image ?? '',
        description: c.desc ?? '',
      })),
      shippingMethods: (shippingMethods.length > 0 ? shippingMethods : ['pickup', 'fedex', 'sea']).map(c => ({ value: c, priceAdjust: 0 })),
      stock: 999,
      createdAt: product.url,
      updatedAt: product.url,
    };
  });
  const customProducts = databaseProducts.filter((product) => !catalogSlugs.has(product.slug));

  return [...importedProducts, ...customProducts];
}

async function isAdminRequest(request: NextRequest) {
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey && adminKey === process.env.ADMIN_API_KEY) return true;
  if (process.env.NODE_ENV === 'development') return true;

  const cookieStore = await import('next/headers').then((m) => m.cookies());
  const sessionData = cookieStore.get('session')?.value;
  if (!sessionData) return false;

  try {
    const session = JSON.parse(sessionData);
    return Boolean(session?.user?.isAdmin);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');
  const featured = searchParams.get('featured');

  try {
    if (id) {
      const product = (await getMergedProducts()).find((item) => item.id === id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

    if (slug) {
      const product = (await getMergedProducts()).find((item) => item.slug === slug);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

    if (category) {
      const products = (await getMergedProducts()).filter((product) => product.category === category);
      return NextResponse.json({ products });
    }

    if (featured === 'true') {
      const products = await getMergedProducts();
      return NextResponse.json({ 
        products: products.filter(p => p.isFeatured) 
      });
    }

    const products = await getMergedProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const product = await db.createProduct({
      slug: body.slug,
      name: body.name,
      shortDesc: body.short_desc ?? body.shortDesc ?? '',
      description: body.description || '',
      category: body.category,
      categoryName: body.category_name ?? body.categoryName ?? body.category,
      price: body.price || 0,
      originalPrice: body.original_price ?? body.originalPrice ?? 0,
      color: body.color || '#7B5DA8',
      features: body.features || [],
      options: body.options || {},
      images: body.images || [],
      badges: body.badges || [],
      isActive: body.is_active ?? body.isActive ?? true,
      isFeatured: body.is_featured ?? body.isFeatured ?? false,
      bodyColors: Array.isArray(body.bodyColors) ? body.bodyColors : [],
      tableColors: Array.isArray(body.tableColors) ? body.tableColors : [],
      tileSizes: Array.isArray(body.tileSizes) ? body.tileSizes : [],
      tileCounts: Array.isArray(body.tileCounts) ? body.tileCounts : [],
      tileColorOptions: Array.isArray(body.tileColorOptions) ? body.tileColorOptions : [],
      legModels: Array.isArray(body.legModels) ? body.legModels : [],
      shippingMethods: Array.isArray(body.shippingMethods) ? body.shippingMethods : [],
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const product = await db.updateProduct(id, {
      slug: updates.slug,
      name: updates.name,
      shortDesc: updates.short_desc,
      description: updates.description,
      category: updates.category,
      categoryName: updates.category_name,
      price: updates.price,
      originalPrice: updates.original_price,
      color: updates.color,
      features: updates.features,
      options: updates.options,
      images: updates.images,
      badges: updates.badges,
      isActive: updates.is_active ?? updates.isActive,
      isFeatured: updates.is_featured ?? updates.isFeatured,
      bodyColors: Array.isArray(updates.bodyColors) ? updates.bodyColors : undefined,
      tableColors: Array.isArray(updates.tableColors) ? updates.tableColors : undefined,
      tileSizes: Array.isArray(updates.tileSizes) ? updates.tileSizes : undefined,
      tileCounts: Array.isArray(updates.tileCounts) ? updates.tileCounts : undefined,
      tileColorOptions: Array.isArray(updates.tileColorOptions) ? updates.tileColorOptions : undefined,
      legModels: Array.isArray(updates.legModels) ? updates.legModels : undefined,
      shippingMethods: Array.isArray(updates.shippingMethods) ? updates.shippingMethods : undefined,
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const success = await db.deleteProduct(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
