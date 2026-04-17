import { NextResponse } from 'next/server'

const RAJAONGKIR_KEY = process.env.RAJAONGKIR_API_KEY!

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    if (search.length < 2) return NextResponse.json({ data: [] })

    const res = await fetch(
      `https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${encodeURIComponent(search)}&limit=8&offset=0`,
      { headers: { 'key': RAJAONGKIR_KEY } }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
