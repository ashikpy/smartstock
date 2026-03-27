import { createItem } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function NewItemPage() {
  async function handleSubmit(formData: FormData) {
    'use server'
    await createItem(formData)
    redirect('/inventory')
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Stock</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Register a new product in the system.</p>
        </div>
      </div>

      <form action={handleSubmit}>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Basic Info */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Main identifiers and descriptive information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Item ID</label>
                <Input name="item_id" placeholder="SKU-123456" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">QR Code Data</label>
                <Input name="qr_code_data" placeholder="Scan result or manual entry" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input name="product_name" placeholder="Gadget Pro 2000" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input name="category" placeholder="Electronics" required />
              </div>
            </CardContent>
          </Card>

          {/* Supplier & Batch */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Stock & Supplier</CardTitle>
              <CardDescription>Logistics and quantity details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier Name</label>
                <Input name="supplier_name" placeholder="Acme Corp" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Batch Number</label>
                <Input name="batch_number" placeholder="BTC-001" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Initial Quantity</label>
                  <Input name="quantity" type="number" defaultValue="0" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Stock Level</label>
                  <Input name="min_stock_level" type="number" defaultValue="10" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Unit Of Measure</label>
                   <Input name="unit_of_measure" placeholder="pcs" required />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Unit Price ($)</label>
                   <Input name="unit_price" type="number" step="0.01" placeholder="0.00" />
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates & Location */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Dates & Location</CardTitle>
              <CardDescription>Lifecycle and storage tracking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Shelf Location</label>
                <Input name="shelf_location" placeholder="A1-Zone-4" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Entry Date</label>
                <Input name="entry_date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Manufacture Date</label>
                  <Input name="manufacture_date" type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry Date</label>
                  <Input name="expiry_date" type="date" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Any other relevant details.</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea 
                name="notes"
                className="w-full h-32 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                placeholder="Fragile, handle with care..."
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
           <Button type="submit" size="lg" className="px-12 gap-2">
              <Save className="h-4 w-4" />
              Save Item
           </Button>
        </div>
      </form>
    </div>
  )
}
