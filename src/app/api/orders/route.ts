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
    const { order_id, customer, items, subtotal, discount, shipping_cost, total, shipping, phone, province } = body

    // Build insert with only safe columns
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
      shipping_courier: shipping?.courier || '',
      shipping_service: shipping?.service || '',
      total: total || 0,
      status: 'pending',
      payment: null,
    }

    // Try adding optional columns one by one
    const optionalCols: Record<string,any> = {
      address: customer?.address || '',
      city: customer?.city || '',
      coupon: body.coupon || null,
      resi: null,
      paid_at: null,
    }

    // First try with all optional cols
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .insert({ ...insertData, ...optionalCols })
        .select().single()
      if (error) throw error
      return NextResponse.json({ data, order_id })
    } catch {
      // Retry with only base columns
      const { data, error } = await supabaseAdmin
        .from('orders')
        .insert(insertData)
        .select().single()
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
