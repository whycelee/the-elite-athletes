import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order_id, amount, customer, items } = body

    const serverKey = process.env.MIDTRANS_SERVER_KEY!
    const isProduction = process.env.MIDTRANS_ENVIRONMENT === 'production'
    const baseUrl = isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions'

    // Base64 encode without Buffer (Edge compatible)
    const credentials = btoa(serverKey + ':')

    const payload = {
      transaction_details: {
        order_id,
        gross_amount: amount,
      },
      customer_details: {
        first_name: (customer?.name || '').split(' ')[0] || 'Customer',
        last_name: (customer?.name || '').split(' ').slice(1).join(' ') || '',
        email: customer?.email || 'customer@email.com',
        phone: customer?.phone || '',
      },
      item_details: (items || []).map((i: any) => ({
        id: i.sku || i.id || 'PROD',
        price: Math.round(i.price),
        quantity: i.qty || 1,
        name: (i.name || 'Product').substring(0, 50),
      })),
      enabled_payments: [
        'credit_card','bca_va','bni_va','bri_va','mandiri_bill',
        'permata_va','other_va','gopay','shopeepay','qris',
        'alfamart','indomaret',
      ],
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Midtrans error:', data)
      throw new Error(data.error_messages?.[0] || data.message || 'Midtrans error')
    }

    return NextResponse.json({ snap_token: data.token, redirect_url: data.redirect_url })
  } catch (e: any) {
    console.error('Snap route error:', e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
