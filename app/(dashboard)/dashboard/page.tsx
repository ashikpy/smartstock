import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Package, Calendar, Clock, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { generateAlerts } from '@/lib/alert-utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Item } from '@/lib/types'
import { updateQuantity } from '@/app/actions'

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  
  // Update alerts on each load
  await generateAlerts()

  const items = await prisma.item.findMany({
    where: {
      status: 'active',
      OR: q ? [
        { product_name: { contains: q } },
        { category: { contains: q } },
        { item_id: { contains: q } }
      ] : undefined
    },
    include: {
      alerts: {
        where: { acknowledged: false }
      }
    },
    orderBy: { updated_at: 'desc' }
  })

  // Stats
  const totalItems = items.length
  const lowStockItems = items.filter((i: Item) => i.quantity <= i.min_stock_level).length
  const expiredItems = items.filter((i: Item) => i.expiry_date && new Date(i.expiry_date) < new Date()).length
  const expiringSoonItems = items.filter((i: Item) => {
    if (!i.expiry_date) return false
    const d = new Date(i.expiry_date)
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return d > now && d < nextWeek
  }).length

  const stats = [
    { label: 'Total Items', value: totalItems, icon: Package, color: 'text-blue-500' },
    { label: 'Low Stock', value: lowStockItems, icon: AlertTriangle, color: 'text-yellow-500' },
    { label: 'Expired', value: expiredItems, icon: Clock, color: 'text-red-500' },
    { label: 'Expiring Soon', value: expiringSoonItems, icon: Calendar, color: 'text-orange-500' },
  ]

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Real-time status of your inventory and alerts.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm">Download Report</Button>
           <Button size="sm">Refresh Data</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-xl transition hover:bg-zinc-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                 <ArrowUpRight className="h-3 w-3 text-green-500" />
                 +12% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Active Inventory</h2>
          <form className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input name="q" placeholder="Search products..." className="pl-10" defaultValue={q} />
          </form>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="px-6 py-4 font-medium">Product Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Quantity</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Expiry</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">No items found.</td>
                  </tr>
                ) : items.map((item: Item) => {
                  const isLow = item.quantity <= item.min_stock_level
                  const isExpired = item.expiry_date && new Date(item.expiry_date) < new Date()
                  const isExpiringSoon = item.expiry_date && 
                                        new Date(item.expiry_date).getTime() < (new Date().getTime() + 7 * 24 * 60 * 60 * 1000) &&
                                        !isExpired
                  
                  return (
                    <tr key={item.item_id} className="group hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                         <div className="font-semibold">{item.product_name}</div>
                         <div className="text-xs text-zinc-500">{item.item_id}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{item.category}</td>
                      <td className="px-6 py-4">
                         <div className={cn("inline-flex items-center gap-1.5 font-medium", isLow ? "text-yellow-500" : "text-zinc-50")}>
                           {item.quantity} {item.unit_of_measure}
                           {isLow && <AlertTriangle className="h-3 w-3" />}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        {isExpired ? (
                          <Badge variant="error">Expired</Badge>
                        ) : isExpiringSoon ? (
                          <Badge variant="warning">Expiring Soon</Badge>
                        ) : isLow ? (
                          <Badge variant="secondary" className="bg-yellow-900/10 text-yellow-500 border-yellow-900/20">Low Stock</Badge>
                        ) : (
                          <Badge variant="success">Healthy</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-zinc-400 text-xs">
                         {item.expiry_date ? formatDate(item.expiry_date) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <form action={async () => { 'use server'; await updateQuantity(item.item_id, 1, 'Quick restock'); }}>
                              <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0 text-emerald-500 text-lg">+</Button>
                           </form>
                           <form action={async () => { 'use server'; await updateQuantity(item.item_id, -1, 'Quick dispatch'); }}>
                              <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 text-lg">-</Button>
                           </form>
                           <Button variant="outline" size="sm">Details</Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
