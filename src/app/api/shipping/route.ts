import { NextResponse } from 'next/server'

const RAJAONGKIR_KEY = process.env.RAJAONGKIR_API_KEY!
const DEFAULT_ORIGIN_ID = '31555' // Tangerang Selatan fallback

export async function POST(req: Request) {
  try {
    const { destination, weight = 500, courier = 'jne', originId } = await req.json()
    if (!destination) return NextResponse.json({ error: 'destination required' }, { status: 400 })

    const body = new URLSearchParams()
    body.append('origin', originId || DEFAULT_ORIGIN_ID)
    body.append('destination', String(destination))
    body.append('weight', String(weight))
    body.append('courier', courier)
    body.append('price', 'lowest')

    const res = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost', {
      method: 'POST',
      headers: { 'key': RAJAONGKIR_KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
