import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sport   = searchParams.get('sport')
    const gender  = searchParams.get('gender')
    const inStock = searchParams.get('inStock') === 'true'

    let query = supabaseAdmin
      .from('products')
      .select('*, stock(*)')
      .order('created_at', { ascending: false })

    if (sport)  query = query.eq('sport', sport)
    if (gender) query = query.eq('gender', gender)

    const { data, error } = await query
    if (error) throw error

    const result = inStock
      ? data.filter(p => (p.stock as any[]).some((s: any) => s.quantity > 0))
      : data

    return NextResponse.json({ data: result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, sku, sport, gender, price, hpp, emoji, desc, sizes, colors } = body

    // Generate ID dari SKU
    const id = sku.toUpperCase().replace(/[^A-Z0-9-]/g, '')

    // Insert produk
    const { data: product, error: prodErr } = await supabaseAdmin
      .from('products')
      .insert({
        id,
        sku:         sku.toUpperCase(),
        name,
        sport,
        gender,
        price:       parseInt(price),
        hpp:         parseInt(hpp) || 0,
        emoji:       emoji || '👕',
        description: desc || '',
        sizes:       sizes || ['S','M','L','XL'],
        colors:      colors || ['Black'],
        status:      'active',
        rating:      5.0,
        review_count: 0,
      })
      .select()
      .single()

    if (prodErr) throw prodErr

    // Insert stok awal 0 untuk setiap ukuran
    const stockRows = (sizes || ['S','M','L','XL']).map((size: string) => ({
      product_id: id,
      size,
      quantity:   0,
    }))

    await supabaseAdmin.from('stock').insert(stockRows)

    return NextResponse.json({ data: product }, { status: 201 })
  } catch (err: any) {
    console.error('Add product error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}