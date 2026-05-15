import { NextResponse } from 'next/server';
import {
  categories,
  getAllStorefrontProducts,
} from '@/lib/storefront-products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getAllStorefrontProducts();
    return NextResponse.json({
      categories: categories.map((c) => ({
        slug: c.slug,
        name: c.name,
        desc: c.desc,
      })),
      products,
    });
  } catch (error) {
    console.error('Failed to load storefront data:', error);
    return NextResponse.json(
      { error: 'Failed to load storefront data' },
      { status: 500 },
    );
  }
}
