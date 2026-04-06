import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
 
// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require('midtrans-client')
 
const core = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_ENVIRONMENT === 'production',
  serverKey:    process.env.MIDTRANS_SERVER_KEY!,
})
 
export async function POST(req: Request) {
  try {
    const notification = await req.json()
 
    // Verifikasi notifikasi dari Midtrans
    const status = await core.transaction.notification(notification)
    const { order_id, transaction_status, fraud_status, payment_type } = status
 
    // Tentukan status order berdasarkan notifikasi Midtrans
    let orderStatus   = 'pending'
    let paymentStatus = 'pending'
    let paid_at: string | null = null
 
    if (
      transaction_status === 'settlement' ||
      (transaction_status === 'capture' && fraud_status === 'accept')
    ) {
      orderStatus   = 'processing'
      paymentStatus = 'paid'
      paid_at       = new Date().toISOString()
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      orderStatus   = 'cancelled'
      paymentStatus = 'failed'
    }
 
    // Update status order di database
    const { data: order } = await supabaseAdmin
      .from('orders')
      .update({
        status:         orderStatus,
        payment_status: paymentStatus,
        payment_method: payment_type,
        ...(paid_at ? { paid_at } : {}),
      })
      .eq('id', order_id)
      .select()
      .single()
 
    // Kalau pembayaran sukses: kurangi stok + update customer totals
    if (paymentStatus === 'paid' && order) {
      const items = order.items as any[]
 
      // Kurangi stok untuk setiap item yang dibeli
      for (const item of items) {
        try {
          await supabaseAdmin.rpc('decrement_stock', {
            p_product_id: item.id,
            p_size:       item.size,
            p_qty:        item.qty,
          })
        } catch (e) {
          console.error('decrement_stock error:', e)
        }
      }
 
      // Update total belanja & tier customer
      try {
        await supabaseAdmin.rpc('update_customer_totals', {
          p_order_id: order_id,
        })
      } catch (e) {
        console.error('update_customer_totals error:', e)
      }
    }
 
    return NextResponse.json({ status: 'OK' })
 
  } catch (err: any) {
    console.error('Midtrans webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
 