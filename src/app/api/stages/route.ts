import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET all stages master
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('stages_master')
      .select('*')
      .order('stage_order', { ascending: true })

    if (error) {
      console.error('Error fetching stages:', error)
      return NextResponse.json({ error: 'Failed to fetch stages' }, { status: 500 })
    }

    return NextResponse.json({ stages: data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
