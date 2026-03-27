import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle, AlertTriangle, Clock, XCircle, Trash2 } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { acknowledgeAlert } from '@/app/actions'
import { Alert, Item } from '@/lib/types'

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    where: { acknowledged: false },
    include: { item: true },
    orderBy: { timestamp: 'desc' }
  }) as (Alert & { item: Item })[]

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Alerts</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage critical notifications and inventory warnings.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm">Acknowledge All</Button>
           <Button size="sm">Configure Alerts</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <Card className="border-dashed border-zinc-800 bg-zinc-900/10">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">System Clear</h3>
              <p className="text-zinc-500 mt-2 max-w-xs">No active alerts detected. Your inventory is currently healthy.</p>
            </CardContent>
          </Card>
        ) : alerts.map((alert: Alert) => (
          <Card key={alert.alert_id} className={cn(
            "border-l-4 bg-zinc-900/50 backdrop-blur-xl transition hover:bg-zinc-900",
             alert.severity === 'high' ? "border-l-red-500 border-zinc-800" :
             alert.severity === 'medium' ? "border-l-orange-500 border-zinc-800" :
             alert.severity === 'warning' ? "border-l-yellow-500 border-zinc-800" :
             "border-l-blue-500 border-zinc-800"
          )}>
            <div className="flex items-center justify-between p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "mt-1 p-2 rounded-lg",
                   alert.severity === 'high' ? "bg-red-500/10" :
                   alert.severity === 'medium' ? "bg-orange-500/10" :
                   alert.severity === 'warning' ? "bg-yellow-500/10" :
                   "bg-blue-500/10"
                )}>
                   {alert.severity === 'high' ? <XCircle className="h-5 w-5 text-red-500" /> :
                    alert.severity === 'medium' ? <Clock className="h-5 w-5 text-orange-500" /> :
                    alert.severity === 'warning' ? <AlertTriangle className="h-5 w-5 text-yellow-500" /> :
                    <Bell className="h-5 w-5 text-blue-500" />}
                </div>
                <div>
                   <h3 className="font-semibold text-zinc-50">{alert.alert_message}</h3>
                   <div className="flex items-center gap-2 mt-1 text-sm text-zinc-500">
                      <span>Item ID: {alert.item_id}</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-800" />
                      <span>{formatDate(alert.timestamp)}</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-800" />
                      <Badge variant="outline" className="text-xs uppercase px-1 leading-none h-4 border-zinc-800 font-normal">
                         {alert.alert_type}
                      </Badge>
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <form action={async () => { 'use server'; await acknowledgeAlert(alert.alert_id); }}>
                    <Button type="submit" variant="secondary" size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Acknowledge
                    </Button>
                 </form>
                 <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-600 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                 </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

