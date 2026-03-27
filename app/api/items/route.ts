import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'active'
    
    const items = await prisma.item.findMany({
      where: {
        category: category || undefined,
        status: status
      },
      orderBy: { product_name: 'asc' }
    })
    
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      item_id, product_name, category, supplier_name, batch_number, 
      unit_of_measure, quantity, min_stock_level, shelf_location, 
      entry_date, expiry_date, unit_price, notes, qr_code_data 
    } = body

    const item = await prisma.$transaction(async (tx) => {
       const newItem = await tx.item.create({
         data: {
           item_id, product_name, category, supplier_name, batch_number,
           unit_of_measure, quantity, min_stock_level, shelf_location,
           entry_date: new Date(entry_date),
           expiry_date: expiry_date ? new Date(expiry_date) : null,
           unit_price, notes, qr_code_data,
           status: 'active'
         }
       })

       await tx.stockMovement.create({
         data: {
           item_id,
           movement_type: 'in',
           quantity_change: quantity,
           previous_quantity: 0,
           new_quantity: quantity,
           reason: 'Initial Entry',
           performed_by: 'API'
         }
       })
       
       return newItem
    })

    return NextResponse.json(item)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
