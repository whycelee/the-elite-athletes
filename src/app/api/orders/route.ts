import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order_id, customer, items, subtotal, discount, shipping_cost, total, shipping, coupon, phone, province } = body

    const insertData: any = {
      id: order_id,
      customer_name: customer?.name || '',
      customer_email: customer?.email || '',
      phone: customer?.phone || phone || '',
      province: customer?.province || province || '',
      items: JSON.stringify(items || []),
      subtotal: subtotal || 0,
      discount: discount || 0,
      shipping_cost: shipping_cost || 0,
      shipping_courier: shipping?.courier || 'JNE',
      shipping_service: shipping?.service || '',
      total: total || 0,
      coupon: coupon || null,
      status: 'pending',
      payment: null,
    }

    // Only add address/city if columns exist — try with, fallback without
    try {
      insertData.address = customer?.address || ''
      insertData.city = customer?.city || ''
      const { data, error } = await supabaseAdmin
        .from('orders').insert(insertData).select().single()
      if (error) throw error
      return NextResponse.json({ data, order_id })
    } catch {
      // Fallback: remove address/city if column doesn't exist
      delete insertData.address
      delete insertData.city
      const { data, error } = await supabaseAdmin
        .from('orders').insert(insertData).select().single()
      if (error) throw error
      return NextResponse.json({ data, order_id })
    }
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
    if (resi !== undefined) updateData.resi = resi
    if (payment !== undefined) updateData.payment = payment
    if (paid_at !== undefined) updateData.paid_at = paid_at
    const { data, error } = await supabaseAdmin
      .from('orders').update(updateData).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
