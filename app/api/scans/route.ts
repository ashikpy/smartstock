import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const scans = await prisma.scanLog.findMany({
      orderBy: { scan_timestamp: 'desc' },
      take: 20,
      include: { item: { select: { product_name: true } } }
    })
    return NextResponse.json(scans)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { item_id, scan_type, alerts_triggered } = await request.json()
    
    if (!item_id) return NextResponse.json({ error: 'Missing item_id' }, { status: 400 })

    const scan = await prisma.scanLog.create({
      data: {
        item_id,
        scan_type,
        alerts_triggered,
        scan_timestamp: new Date()
      }
    })
    return NextResponse.json(scan)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
