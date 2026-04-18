import { NextResponse } from 'next/server'

const RAJAONGKIR_KEY = process.env.RAJAONGKIR_API_KEY!

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const awb = searchParams.get('awb')
    const courier = searchParams.get('courier') || 'jne'

    if (!awb) return NextResponse.json({ error: 'awb required' }, { status: 400 })

    const res = await fetch(
      `https://rajaongkir.komerce.id/api/v1/track/waybill?awb=${encodeURIComponent(awb)}&courier=${courier}`,
      { method: 'POST', headers: { 'key': RAJAONGKIR_KEY } }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
