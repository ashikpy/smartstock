export type ItemStatus = 'active' | 'deleted'

export interface Item {
  item_id: string
  qr_code_data: string
  product_name: string
  category: string
  supplier_name: string
  batch_number: string
  unit_of_measure: string
  quantity: number
  min_stock_level: number
  shelf_location: string
  entry_date: Date
  expiry_date: Date | null
  manufacture_date: Date | null
  unit_price: number | null
  notes: string | null
  created_at: Date
  updated_at: Date
  status: ItemStatus
}

export interface StockMovement {
  movement_id: number
  item_id: string
  movement_type: 'in' | 'out' | 'adjustment'
  quantity_change: number
  previous_quantity: number
  new_quantity: number
  reason: string | null
  performed_by: string
  timestamp: Date
}

export interface Alert {
  alert_id: number
  item_id: string
  alert_type: 'low_stock' | 'expired' | 'expiring_soon'
  alert_message: string
  severity: 'low' | 'medium' | 'high' | 'warning'
  timestamp: Date
  acknowledged: boolean
}
