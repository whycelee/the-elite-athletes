import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sport  = searchParams.get('sport')
    const gender = searchParams.get('gender')

    let query = supabaseAdmin
      .from('products')
      .select('*, stock(*)')
      .order('created_at', { ascending: false })

    if (gender) query = query.eq('gender', gender)

    const { data, error } = await query
    if (error) throw error

    // Filter sport — check both main sport and tags array
    const result = sport
      ? data.filter(p =>
          p.sport === sport ||
          (Array.isArray(p.tags) && p.tags.includes(sport))
        )
      : data

    return NextResponse.json({ data: result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, sku, sport, gender, price, hpp, emoji, desc, sizes, colors, tags } = body

    if (!name || !sku || !price) {
      return NextResponse.json({ error: 'name, sku, price wajib diisi' }, { status: 400 })
    }

    const id = sku.toUpperCase().replace(/[^A-Z0-9-]/g, '')

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
        tags:        tags || [],   // multi-sport tags
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