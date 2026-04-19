import { NextResponse } from 'next/server'

const RAJAONGKIR_KEY = process.env.RAJAONGKIR_API_KEY!
const ORIGIN_ID = '31555' // Tangerang Selatan

export async function POST(req: Request) {
  try {
    const { destination, weight = 500, courier = 'jne' } = await req.json()
    if (!destination) return NextResponse.json({ error: 'destination required' }, { status: 400 })

    const body = new URLSearchParams()
    body.append('origin', ORIGIN_ID)
    body.append('destination', destination)
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
