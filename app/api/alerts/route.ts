import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const acknowledged = searchParams.get('acknowledged')
    
    const alerts = await prisma.alert.findMany({
      where: {
        acknowledged: acknowledged === 'true' ? true : acknowledged === 'false' ? false : undefined
      },
      include: { item: { select: { product_name: true } } },
      orderBy: { timestamp: 'desc' },
      take: 50
    })
    
    return NextResponse.json(alerts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { item_id, alert_type, alert_message, severity } = await request.json()
    
    if (!item_id || !alert_type || !alert_message || !severity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const alert = await prisma.alert.create({
      data: {
        item_id,
        alert_type,
        alert_message,
        severity,
        timestamp: new Date(),
        acknowledged: false
      }
    })
    return NextResponse.json(alert)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
