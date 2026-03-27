'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scan, Focus, AlertTriangle, ShieldCheck, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(true)
  const [detectedItem, setDetectedItem] = useState<{
    id: string,
    name: string,
    category: string,
    confidence: number,
    status: string
  } | null>(null)

  useEffect(() => {
    if (!isScanning) return
    const timer = setTimeout(() => {
      setDetectedItem({
        id: "SKU-992381",
        name: "Lithium-Ion Battery Pack",
        category: "Electronics",
        confidence: 99.4,
        status: "healthy"
      })
    }, 2000)
    return () => clearTimeout(timer)
  }, [isScanning])

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Scan Simulation</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Intelligent object detection and entry matching.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant={isScanning ? "primary" : "outline"} onClick={() => { setIsScanning(!isScanning); setDetectedItem(null); }}>
             {isScanning ? "Pause Scanner" : "Start Scanner"}
           </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Camera Feed */}
        <Card className="relative overflow-hidden border-zinc-800 bg-black aspect-video flex items-center justify-center">
            {/* Simulation Overlay */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-1/2 left-0 w-full h-px bg-emerald-500/50 shadow-[0_0_10px_2px_rgba(16,185,129,0.5)] animate-scan-line" />
                 
                 {/* Detection Box */}
                 {detectedItem && (
                   <div className="absolute top-[20%] left-[30%] right-[30%] bottom-[30%] border-2 border-emerald-500 rounded-lg animate-pulse-once">
                      <div className="absolute -top-10 left-0 bg-emerald-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded leading-tight">
                         OBJECT_DETECTED: {detectedItem.confidence}%
                      </div>
                      {/* Corner Accents */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white" />
                   </div>
                 )}
              </div>
            )}
            
            <div className="flex flex-col items-center gap-4 text-zinc-700">
               <Focus className="h-16 w-16" />
               <p className="text-sm font-medium uppercase tracking-widest">{isScanning ? "Camera Feed Active" : "Camera Feed Paused"}</p>
            </div>
            
            {/* Stats Overlay */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-zinc-800 p-3 rounded-lg flex flex-col gap-1 text-[10px] font-mono text-emerald-500">
               <div className="flex justify-between gap-6"><span>FPS:</span><span>60</span></div>
               <div className="flex justify-between gap-6"><span>LATENCY:</span><span>12ms</span></div>
               <div className="flex justify-between gap-6"><span>BUFFER:</span><span>OK</span></div>
            </div>
        </Card>

        {/* Detection Metadata */}
        <div className="space-y-6">
           <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl h-full">
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Detection Results
                 </CardTitle>
                 <CardDescription>Mapped database entries for current frame.</CardDescription>
              </CardHeader>
              <CardContent>
                 {detectedItem ? (
                    <div className="space-y-6">
                       <div className="flex items-start justify-between">
                          <div>
                             <h3 className="text-xl font-bold">{detectedItem.name}</h3>
                             <p className="text-sm text-zinc-500">{detectedItem.id}</p>
                          </div>
                          <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                             Healthy
                          </Badge>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/50">
                             <div className="text-zinc-500 text-xs mb-1">Category</div>
                             <div className="font-medium">{detectedItem.category}</div>
                          </div>
                          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/50">
                             <div className="text-zinc-500 text-xs mb-1">Stock Level</div>
                             <div className="font-medium">1,200 Packs</div>
                          </div>
                          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/50">
                             <div className="text-zinc-500 text-xs mb-1">Last Synced</div>
                             <div className="font-medium">2 mins ago</div>
                          </div>
                          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/50">
                             <div className="text-zinc-500 text-xs mb-1">Location</div>
                             <div className="font-medium">WH-B / Shelf 12</div>
                          </div>
                       </div>
                       
                       <div className="pt-4 flex gap-2">
                          <Button className="flex-1">Update Stock</Button>
                          <Button variant="outline" className="flex-1">View Full History</Button>
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                       <Scan className="h-12 w-12 text-zinc-800 mb-4 animate-pulse" />
                       <p className="text-zinc-500 text-sm max-w-[200px]">Scanning for items with QR/RFID markers...</p>
                    </div>
                 )}
              </CardContent>
           </Card>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-200%); }
          100% { transform: translateY(200%); }
        }
        .animate-scan-line {
          animation: scanline 3s linear infinite;
        }
        @keyframes pulse-once {
          0% { border-color: rgba(16, 185, 129, 0); }
          50% { border-color: rgba(16, 185, 129, 1); }
          100% { border-color: rgba(16, 185, 129, 0.5); }
        }
        .animate-pulse-once {
          animation: pulse-once 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
