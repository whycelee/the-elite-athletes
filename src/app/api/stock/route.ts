import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET: ambil stok produk
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('product_id')

    let query = supabaseAdmin.from('stock').select('*')
    if (productId) query = query.eq('product_id', productId)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT: update stok dari admin dashboard
export async function PUT(req: Request) {
  try {
    const { product_id, updates } = await req.json()
    // updates: [{ size: 'M', quantity: 20 }, ...]

    for (const { size, quantity } of updates) {
      const { error } = await supabaseAdmin
        .from('stock')
        .upsert({ product_id, size, quantity }, { onConflict: 'product_id,size' })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}