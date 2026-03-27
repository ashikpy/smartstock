import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addDays } from 'date-fns'

export async function GET() {
  try {
    const now = new Date()
    const nextWeek = addDays(now, 7)

    // Using Promise.all for parallel aggregation queries
    const [
      totalItems,
      categories,
      lowStockItems,
      expiredItems,
      expiringSoonItems,
      unreadAlerts
    ] = await Promise.all([
      prisma.item.count({ where: { status: 'active' } }),
      prisma.item.groupBy({
        by: ['category'],
        where: { status: 'active' },
        _count: true
      }),
      prisma.item.count({ 
        where: { 
          status: 'active',
          quantity: { lte: prisma.item.fields.min_stock_level as any } // Fallback if raw logic needed
        } 
      }),
      prisma.item.count({
        where: {
          status: 'active',
          expiry_date: { lt: now }
        }
      }),
      prisma.item.count({
        where: {
          status: 'active',
          expiry_date: {
            gte: now,
            lte: nextWeek
          }
        }
      }),
      prisma.alert.count({ where: { acknowledged: false } })
    ])

    // Wait, prisma.item.fields.min_stock_level might not work in SQLite for count comparison in Prisma directly
    // If Prisma doesn't support field-to-field comparison in where, I'll use raw for low_stock
    
    const lowStockRaw = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM "Item" 
      WHERE "status" = 'active' AND "quantity" <= "min_stock_level"
    ` as any[]

    return NextResponse.json({
      total_items: totalItems,
      total_categories: categories.length,
      low_stock_count: Number(lowStockRaw[0]?.count || 0),
      expired_count: expiredItems,
      expiring_soon_count: expiringSoonItems,
      unread_alerts: unreadAlerts
    })
  } catch (error) {
    console.error('Stats Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
