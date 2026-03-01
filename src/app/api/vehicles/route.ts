
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET all vehicles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('vehicles')
      .select(`
        *,
        images:vehicle_images(*)
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (status && ['available', 'ordered', 'sold'].includes(status)) {
      query = query.eq('status', status as 'available' | 'ordered' | 'sold')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching vehicles:', error)
      return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 })
    }

    return NextResponse.json({ vehicles: data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// CREATE a new vehicle (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).role === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      title, brand, model, year, description, price, currency,
      mileage, transmission, fuel_type, engine_capacity, color, grade,
      images
    } = body

    // Create vehicle
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert({
        title,
        brand,
        model,
        year,
        description,
        price,
        currency: currency || 'LKR',
        mileage,
        transmission,
        fuel_type,
        engine_capacity,
        color,
        grade,
        status: 'available'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating vehicle:', error)
      return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 })
    }

    // Add images if provided
    if (images && images.length > 0) {
      const imageInserts = images.map((img: { url: string; type?: string }) => ({
        vehicle_id: vehicle.id,
        image_url: img.url,
        image_type: img.type || 'general'
      }))

      await supabase.from('vehicle_images').insert(imageInserts)
    }

    return NextResponse.json({ vehicle }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
