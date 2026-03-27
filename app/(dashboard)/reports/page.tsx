import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Download, FileSpreadsheet, FilePieChart, Filter } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { StockMovement, Item } from '@/lib/types'

export default async function ReportsPage() {
  const movements = await prisma.stockMovement.findMany({
    include: { item: true },
    orderBy: { timestamp: 'desc' },
    take: 20
  })

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Reports</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Generate and export inventory lifecycle documentation.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download Full CSV
           </Button>
           <Button size="sm" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analyze Stats
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Analytics Summary */}
        <Card className="border-zinc-800 bg-zinc-900/40 border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-zinc-400">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold font-mono">$1,245,392.00</div>
             <p className="text-[10px] text-zinc-500/80 mt-1">Calculated from unit prices and stock quantity.</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/40 border-l-4 border-l-emerald-500">
           <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Turnover Rate (Monthly)</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold">14.2%</div>
              <p className="text-[10px] text-zinc-500/80 mt-1">Inbound vs Outbound movement ratio.</p>
           </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/40 border-l-4 border-l-purple-500">
           <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Order Accuracy</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold">99.8%</div>
              <p className="text-[10px] text-zinc-500/80 mt-1">Physical count vs System database count.</p>
           </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Recent Movements Log</h2>
            <div className="flex gap-2">
               <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">Yesterday</Button>
               <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white bg-zinc-900">Last 7 Days</Button>
               <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">Custom Range</Button>
            </div>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
           <div className="overflow-x-auto font-sans">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
                    <th className="px-6 py-4 font-bold">Log Ref</th>
                    <th className="px-6 py-4 font-bold">Timestamp</th>
                    <th className="px-6 py-4 font-bold">Item Identifier</th>
                    <th className="px-6 py-4 font-bold">Operation</th>
                    <th className="px-6 py-4 font-bold">Qty Change</th>
                    <th className="px-6 py-4 font-bold">New Balance</th>
                    <th className="px-6 py-4 font-bold">Performed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 font-mono">
                  {movements.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-zinc-500 font-sans">No movements recorded yet.</td>
                    </tr>
                  ) : (movements as (StockMovement & { item: Item })[]).map((mv) => (
                    <tr key={mv.movement_id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-4 text-zinc-500">#M-{mv.movement_id}</td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap">{new Date(mv.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 font-sans font-medium text-xs">
                         {mv.item.product_name}
                         <div className="text-[10px] text-zinc-500 opacity-70">{mv.item_id}</div>
                      </td>
                      <td className="px-6 py-4">
                         {mv.movement_type === 'in' ? (
                           <Badge variant="success" className="bg-green-500/10 text-green-400 rounded-sm">INBOUND</Badge>
                         ) : mv.movement_type === 'out' ? (
                           <Badge variant="error" className="bg-red-500/10 text-red-100 rounded-sm">OUTBOUND</Badge>
                         ) : (
                           <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 rounded-sm">ADJUST</Badge>
                         )}
                      </td>
                      <td className={cn(
                        "px-6 py-4 font-bold",
                        mv.quantity_change > 0 ? "text-emerald-500" : "text-red-400"
                      )}>
                         {mv.quantity_change > 0 ? '+' : ''}{mv.quantity_change}
                      </td>
                      <td className="px-6 py-4 font-bold">{mv.new_quantity}</td>
                      <td className="px-6 py-4 text-xs text-zinc-400 font-sans">{mv.performed_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </Card>
      </div>
    </div>
  )
}

