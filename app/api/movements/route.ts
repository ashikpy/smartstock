import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('item_id')
    const movementType = searchParams.get('type')
    
    const movements = await prisma.stockMovement.findMany({
      where: {
        item_id: itemId || undefined,
        movement_type: movementType || undefined
      },
      include: { item: { select: { product_name: true } } },
      orderBy: { timestamp: 'desc' },
      take: 50
    })
    
    return NextResponse.json(movements)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { item_id, quantity_change, movement_type, reason, performed_by } = await request.json()
    
    // Validate
    if (!item_id || !quantity_change || !movement_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
       const current = await tx.item.findUnique({
         where: { item_id },
         select: { quantity: true, status: true }
       })

       if (!current || current.status !== 'active') throw new Error('Item not found or inactive')
       
       const newQuantity = current.quantity + quantity_change
       if (newQuantity < 0) throw new Error('Insufficient stock')

       const movement = await tx.stockMovement.create({
         data: {
           item_id,
           movement_type,
           quantity_change,
           previous_quantity: current.quantity,
           new_quantity: newQuantity,
           reason,
           performed_by: performed_by || 'API'
         }
       })

       await tx.item.update({
         where: { item_id },
         data: { quantity: newQuantity }
       })

       return movement
    })

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
