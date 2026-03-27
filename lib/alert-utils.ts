import { prisma } from './prisma'
import { addDays, isBefore, isAfter } from 'date-fns'

export async function generateAlerts() {
  const items = await prisma.item.findMany({
    where: { status: 'active' }
  })
  
  const now = new Date()
  const expiringThreshold = addDays(now, 7)
  
  for (const item of items) {
    // 1. Check for expired
    if (item.expiry_date && isBefore(new Date(item.expiry_date), now)) {
      await createOrUpdateAlert(item.item_id, 'expired', `Item "${item.product_name}" has expired!`, 'high')
    } 
    // 2. Check for expiring soon
    else if (item.expiry_date && isBefore(new Date(item.expiry_date), expiringThreshold)) {
       await createOrUpdateAlert(item.item_id, 'expiring_soon', `Item "${item.product_name}" is expiring within 7 days.`, 'medium')
    }
    
    // 3. Check for low stock
    if (item.quantity <= item.min_stock_level) {
       await createOrUpdateAlert(item.item_id, 'low_stock', `Item "${item.product_name}" is low on stock (${item.quantity} remaining).`, 'warning')
    }
  }
}

async function createOrUpdateAlert(itemId: string, type: string, message: string, severity: string) {
  const existing = await prisma.alert.findFirst({
    where: {
      item_id: itemId,
      alert_type: type,
      acknowledged: false
    }
  })
  
  if (!existing) {
    await prisma.alert.create({
      data: {
        item_id: itemId,
        alert_type: type,
        alert_message: message,
        severity: severity,
        timestamp: new Date()
      }
    })
  }
}
