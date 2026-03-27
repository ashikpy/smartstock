import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const alertId = parseInt(id)
    
    if (isNaN(alertId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

    const updated = await prisma.alert.update({
      where: { alert_id: alertId },
      data: { acknowledged: true }
    })
    
    return NextResponse.json({ success: true, alert_id: updated.alert_id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
