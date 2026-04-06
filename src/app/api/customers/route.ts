import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .order('total_spent', { ascending: false })

    if (error) throw error

    // Normalisasi format agar cocok dengan UI
    const normalized = data.map(c => ({
      ...c,
      totalSpent: c.total_spent,
      joinDate:   c.created_at,
      lastOrder:  c.updated_at,
      orders:     Array(c.order_count).fill(''),
    }))

    return NextResponse.json({ data: normalized })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}