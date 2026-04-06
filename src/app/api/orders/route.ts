import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
 
// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require('midtrans-client')
 
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_ENVIRONMENT === 'production',
  serverKey:    process.env.MIDTRANS_SERVER_KEY!,
})
 
// GET: list semua order (admin)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
 
    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
 
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
 
    const { data, error } = await query
    if (error) throw error
 
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
 
// POST: buat order baru + Midtrans Snap token
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      customer,
      items,
      shipping,
      promo_code,
      subtotal,
      discount,
      shipping_cost,
      total,
    } = body
 
    // 1. Upsert customer (buat baru atau update jika email sudah ada)
    const { data: cust } = await supabaseAdmin
      .from('customers')
      .upsert(
        {
          name:     customer.name,
          email:    customer.email,
          phone:    customer.phone,
          address:  customer.address,
          city:     customer.city,
          province: customer.province,
        },
        { onConflict: 'email' }
      )
      .select()
      .single()
 
    // 2. Buat order di database
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_id:       cust?.id,
        customer_name:     customer.name,
        customer_email:    customer.email,
        customer_phone:    customer.phone,
        subtotal,
        shipping_cost,
        discount_amount:   discount,
        total,
        promo_code,
        shipping_address:  customer.address,
        shipping_city:     customer.city,
        shipping_province: customer.province,
        shipping_courier:  shipping?.courier,
        items,
      })
      .select()
      .single()
 
    if (orderErr) throw orderErr
 
    // 3. Buat Midtrans Snap token
    const midtransParam = {
      transaction_details: {
        order_id:     order.id,
        gross_amount: total,
      },
      customer_details: {
        first_name: customer.name.split(' ')[0],
        last_name:  customer.name.split(' ').slice(1).join(' ') || '-',
        email:      customer.email,
        phone:      customer.phone,
      },
      item_details: [
        ...items.map((i: any) => ({
          id:       i.sku || i.id,
          name:     `${i.name} (${i.size})`,
          price:    i.price,
          quantity: i.qty,
        })),
        ...(shipping_cost > 0
          ? [{ id: 'SHIPPING', name: `Ongkir ${shipping?.courier || ''}`, price: shipping_cost, quantity: 1 }]
          : []),
        ...(discount > 0
          ? [{ id: 'DISCOUNT', name: `Diskon ${promo_code || ''}`, price: -discount, quantity: 1 }]
          : []),
      ],
      enabled_payments: [
        'bca_va', 'bni_va', 'bri_va', 'mandiri_va',
        'gopay', 'shopeepay', 'qris', 'credit_card',
      ],
    }
 
    const transaction = await snap.createTransaction(midtransParam)
 
    // 4. Simpan midtrans_order_id ke database
    await supabaseAdmin
      .from('orders')
      .update({ midtrans_order_id: order.id })
      .eq('id', order.id)
 
    return NextResponse.json(
      {
        order_id:     order.id,
        snap_token:   transaction.token,
        redirect_url: transaction.redirect_url,
      },
      { status: 201 }
    )
 
  } catch (err: any) {
    console.error('Create order error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
 