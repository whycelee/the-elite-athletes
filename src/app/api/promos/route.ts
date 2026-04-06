import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json()

    const { data: promo, error } = await supabaseAdmin
      .from('promos')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single()

    if (error || !promo) {
      return NextResponse.json({ valid: false, message: 'Kode promo tidak valid' })
    }

    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, message: 'Kode promo sudah kadaluarsa' })
    }

    if (promo.max_usage && promo.usage_count >= promo.max_usage) {
      return NextResponse.json({ valid: false, message: 'Kuota promo habis' })
    }

    if (subtotal < promo.min_order) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order Rp ${Number(promo.min_order).toLocaleString('id-ID')}`,
      })
    }

    const discount =
      promo.type === 'percentage'
        ? Math.round((subtotal * promo.value) / 100)
        : promo.value

    return NextResponse.json({ valid: true, discount, promo })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}