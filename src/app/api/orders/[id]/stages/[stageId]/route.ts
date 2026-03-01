import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// Update order stage status (Admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; stageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).role === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admin can update stages' }, { status: 403 })
    }

    const body = await request.json()
    const { status, notes, estimated_date } = body

    // Update the order stage
    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (estimated_date !== undefined) updateData.estimated_date = estimated_date
    
    if (status === 'completed') {
      updateData.completed_date = new Date().toISOString()
    } else if (status === 'pending') {
      // Reset completed_date when uncompleting
      updateData.completed_date = null
    }

    const { data: orderStage, error } = await supabase
      .from('order_stages')
      .update(updateData)
      .eq('order_id', params.id)
      .eq('stage_id', params.stageId)
      .select(`*, stage_master:stages_master!stage_id(*)`)
      .single()

    if (error) {
      console.error('Error updating order stage:', error)
      return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 })
    }

    // If completed, update order's current_stage_id to next stage
    if (status === 'completed') {
      const stageData = orderStage as any
      const currentStageOrder = stageData.stage_master?.stage_order || 0
      
      // Get next stage
      const { data: nextStage } = await supabase
        .from('stages_master')
        .select('id')
        .gt('stage_order', currentStageOrder)
        .order('stage_order', { ascending: true })
        .limit(1)
        .single()

      if (nextStage) {
        await supabase
          .from('orders')
          .update({ current_stage_id: nextStage.id })
          .eq('id', params.id)
      }
    }

    return NextResponse.json({ orderStage })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
