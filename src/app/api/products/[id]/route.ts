// src/app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { name, price, original, hpp, description, sport, gender,
            tags, sizes, colors, image_url, gallery, stock } = body

    // Update product
    const { error: prodErr } = await supabaseAdmin
      .from('products')
      .update({
        name, price, original_price: original ?? null,
        hpp: hpp || 0, description, sport, gender,
        tags: tags || [], sizes, colors,
        image_url: image_url || null,
        gallery: gallery || [],
      })
      .eq('id', params.id)

    if (prodErr) throw prodErr

    // Update stock per size
    if (stock) {
      for (const [size, quantity] of Object.entries(stock)) {
        await supabaseAdmin
          .from('stock')
          .upsert({ product_id: params.id, size, quantity: quantity as number },
                   { onConflict: 'product_id,size' })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}