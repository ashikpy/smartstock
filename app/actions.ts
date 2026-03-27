'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createItem(formData: FormData) {
  const itemId = formData.get('item_id') as string
  const qrCodeData = formData.get('qr_code_data') as string
  const productName = formData.get('product_name') as string
  const category = formData.get('category') as string
  const supplierName = formData.get('supplier_name') as string
  const batchNumber = formData.get('batch_number') as string
  const unitOfMeasure = formData.get('unit_of_measure') as string
  const quantity = parseInt(formData.get('quantity') as string)
  const minStockLevel = parseInt(formData.get('min_stock_level') as string)
  const shelfLocation = formData.get('shelf_location') as string
  const entryDate = new Date(formData.get('entry_date') as string)
  const expiryDateString = formData.get('expiry_date') as string
  const manufactureDateString = formData.get('manufacture_date') as string
  const unitPrice = parseFloat(formData.get('unit_price') as string) || 0
  const notes = formData.get('notes') as string

  await prisma.item.create({
    data: {
      item_id: itemId,
      qr_code_data: qrCodeData,
      product_name: productName,
      category: category,
      supplier_name: supplierName,
      batch_number: batchNumber,
      unit_of_measure: unitOfMeasure,
      quantity: quantity,
      min_stock_level: minStockLevel,
      shelf_location: shelfLocation,
      entry_date: entryDate,
      expiry_date: expiryDateString ? new Date(expiryDateString) : null,
      manufacture_date: manufactureDateString ? new Date(manufactureDateString) : null,
      unit_price: unitPrice,
      notes: notes,
      status: 'active'
    }
  })

  // Initial stock movement
  await prisma.stockMovement.create({
    data: {
      item_id: itemId,
      movement_type: 'in',
      quantity_change: quantity,
      previous_quantity: 0,
      new_quantity: quantity,
      reason: 'Initial stock entry',
      performed_by: 'Admin'
    }
  })

  revalidatePath('/dashboard')
  revalidatePath('/inventory')
}

export async function updateQuantity(itemId: string, change: number, reason: string) {
  const item = await prisma.item.findUnique({
    where: { item_id: itemId }
  })

  if (!item) throw new Error('Item not found')

  const newQuantity = Math.max(0, item.quantity + change)

  await prisma.$transaction([
    prisma.item.update({
      where: { item_id: itemId },
      data: { quantity: newQuantity }
    }),
    prisma.stockMovement.create({
      data: {
        item_id: itemId,
        movement_type: change > 0 ? 'in' : 'out',
        quantity_change: change,
        previous_quantity: item.quantity,
        new_quantity: newQuantity,
        reason: reason,
        performed_by: 'System'
      }
    })
  ])

  revalidatePath('/dashboard')
  revalidatePath('/inventory')
}

export async function deleteItem(itemId: string) {
  await prisma.item.update({
    where: { item_id: itemId },
    data: { status: 'deleted' }
  })
  
  revalidatePath('/dashboard')
  revalidatePath('/inventory')
}

export async function acknowledgeAlert(alertId: number) {
  await prisma.alert.update({
    where: { alert_id: alertId },
    data: { acknowledged: true }
  })
  
  revalidatePath('/dashboard')
  revalidatePath('/alerts')
}
