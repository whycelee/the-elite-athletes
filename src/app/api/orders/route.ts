import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error

    // Normalize to consistent field names for frontend
    const normalized = (data || []).map((o: any) => ({
      ...o,
      customerName: o.customer_name || o.customerName || '',
      phone: o.phone || o.customer_phone || '',
      address: o.address || o.shipping_address || '',
      city: o.city || o.shipping_city || '',
      province: o.province || o.shipping_province || '',
      payment: o.payment || o.payment_method || '',
      resi: o.resi || o.tracking_number || '',
      items: typeof o.items === 'string' ? JSON.parse(o.items || '[]') : (o.items || []),
      date: o.date || o.created_at || new Date().toISOString(),
    }))

    return NextResponse.json({ data: normalized })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order_id, customer, items, subtotal, discount, shipping_cost, total, shipping, phone, province } = body

    const insertData: any = {
      // Core fields - match exact column names in Supabase
      customer_name: customer?.name || '',
      customer_email: customer?.email || '',
      customer_phone: customer?.phone || phone || '',
      shipping_address: customer?.address || '',
      shipping_city: customer?.city || '',
      shipping_province: customer?.province || province || '',
      shipping_courier: shipping?.courier || '',
      shipping_service: shipping?.service || '',
      items: JSON.stringify(items || []),
      total: total || 0,
      status: 'pending',
    }

    // Add optional numeric columns
    if (subtotal !== undefined) insertData.subtotal = subtotal
    if (discount !== undefined) insertData.discount = discount
    if (shipping_cost !== undefined) insertData.shipping_cost = shipping_cost

    // Use midtrans_order_id if column exists, fallback to id
    if (order_id) {
      insertData.midtrans_order_id = order_id
      // Try setting id too
      try { insertData.id = order_id } catch {}
    }

    if (body.coupon) insertData.promo_code = body.coupon

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data, order_id: data.id || order_id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, status, resi, payment, paid_at } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (resi !== undefined) {
      updateData.resi = resi
      updateData.tracking_number = resi
    }
    if (payment !== undefined) {
      updateData.payment = payment
      updateData.payment_method = payment
    }
    if (paid_at !== undefined) updateData.paid_at = paid_at

    const { data, error } = await supabaseAdmin
      .from('orders').update(updateData).eq('id', id).select().single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
