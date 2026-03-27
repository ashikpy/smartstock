import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Item } from '@/lib/types'
import Link from 'next/link'
import { deleteItem } from '@/app/actions'

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  const items = await prisma.item.findMany({
    where: {
      status: 'active',
      OR: q ? [
        { product_name: { contains: q } },
        { category: { contains: q } },
        { item_id: { contains: q } },
        { supplier_name: { contains: q } }
      ] : undefined
    },
    orderBy: { updated_at: 'desc' }
  })

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-zinc-500 dark:text-zinc-400">View and manage all items in stock.</p>
        </div>
        <Link href="/inventory/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Item
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <form className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input name="q" placeholder="Filter by name, SKU, or supplier..." className="pl-10" defaultValue={q} />
        </form>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Advanced Filters
        </Button>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="px-6 py-4 font-medium">SKU / ID</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Quantity</th>
                <th className="px-6 py-4 font-medium">Shelf</th>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium">Expiry</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-zinc-500">No inventory matches your search.</td>
                </tr>
              ) : items.map((item: Item) => (
                <tr key={item.item_id} className="group hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-zinc-400 text-xs">
                    {item.item_id}
                  </td>
                  <td className="px-6 py-4 font-medium">{item.product_name}</td>
                  <td className="px-6 py-4">
                     <Badge variant="outline" className="font-normal text-xs">{item.category}</Badge>
                  </td>
                  <td className="px-6 py-4">
                     <span className={cn(
                       "font-medium",
                       item.quantity <= item.min_stock_level ? "text-yellow-500" : "text-emerald-500"
                     )}>
                       {item.quantity} {item.unit_of_measure}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{item.shelf_location}</td>
                  <td className="px-6 py-4 text-zinc-400">{item.supplier_name}</td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">
                     {item.expiry_date ? formatDate(item.expiry_date) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                         <Eye className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                         <Edit className="h-4 w-4" />
                       </Button>
                       <form action={async () => { 'use server'; await deleteItem(item.item_id); }}>
                         <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500">
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
