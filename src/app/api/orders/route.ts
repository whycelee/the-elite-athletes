import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET all orders
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, customers(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST create new order
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      order_id, customer, items, subtotal, discount,
      shipping_cost, total, shipping, coupon,
    } = body

    // Upsert customer
    let customerId = null
    if (customer?.email) {
      const { data: cust } = await supabaseAdmin
        .from('customers')
        .upsert({ email: customer.email, name: customer.name, phone: customer.phone }, { onConflict: 'email' })
        .select()
        .single()
      customerId = cust?.id
    }

    // Create order
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        id: order_id,
        customer_id: customerId,
        customer_name: customer?.name,
        customer_email: customer?.email,
        phone: customer?.phone,
        address: customer?.address,
        city: customer?.city,
        province: customer?.province,
        items: JSON.stringify(items),
        subtotal,
        discount: discount || 0,
        shipping_cost: shipping_cost || 0,
        shipping_courier: shipping?.courier || 'JNE',
        shipping_service: shipping?.service,
        total,
        coupon: coupon || null,
        status: 'pending',
        payment: null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data, order_id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// PATCH update order status/resi
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
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
