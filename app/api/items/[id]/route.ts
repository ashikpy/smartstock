import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const item = await prisma.item.findUnique({
      where: { item_id: id },
      include: {
        stock_movements: {
          orderBy: { timestamp: 'desc' },
          take: 5
        },
        alerts: {
          where: { acknowledged: false },
          orderBy: { timestamp: 'desc' },
          take: 3
        }
      }
    })

    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Whitelist update fields
    const { product_name, category, min_stock_level, shelf_location, unit_price, notes } = body
    
    const updated = await prisma.item.update({
      where: { item_id: id },
      data: { product_name, category, min_stock_level, shelf_location, unit_price, notes }
    })
    
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const deleted = await prisma.item.update({
      where: { item_id: id },
      data: { status: 'deleted' }
    })
    
    return NextResponse.json({ success: true, item_id: deleted.item_id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
