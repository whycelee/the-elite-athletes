import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body

    // Verify signature from Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY!
    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex')

    if (hash !== signature_key) {
      console.error('Invalid Midtrans signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Map Midtrans status to our order status
    let newStatus: string | null = null

    if (transaction_status === 'capture' && fraud_status === 'accept') {
      newStatus = 'processing' // Paid - credit card
    } else if (transaction_status === 'settlement') {
      newStatus = 'processing' // Paid - transfer/qris settled
    } else if (transaction_status === 'pending') {
      newStatus = 'pending' // Waiting payment
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      newStatus = 'cancelled' // Failed
    } else if (transaction_status === 'refund') {
      newStatus = 'refund'
    }

    if (!newStatus) {
      return NextResponse.json({ message: 'Status not mapped, ignored' })
    }

    // Update order in Supabase
    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        status: newStatus,
        payment: payment_type,
        paid_at: ['processing'].includes(newStatus) ? new Date().toISOString() : null,
      })
      .eq('id', order_id)

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`Order ${order_id} updated to ${newStatus} via Midtrans webhook`)
    return NextResponse.json({ success: true, order_id, status: newStatus })

  } catch (e: any) {
    console.error('Webhook error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
