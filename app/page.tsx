import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Warehouse, ArrowRight, Shield, Zap, BarChart, Globe, Zap as ZapIcon, Package, Scan, Bell, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50">
               <Warehouse className="h-5 w-5 text-zinc-950" />
             </div>
             <span className="text-xl font-bold tracking-tight text-white font-sans">SmartStock</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
             <Link href="#features" className="hover:text-white transition-colors">Features</Link>
             <Link href="#solutions" className="hover:text-white transition-colors">Solutions</Link>
             <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
             <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Log in</Link>
             <Link href="/dashboard">
                <Button size="sm" className="bg-emerald-500 text-black hover:bg-emerald-400 font-bold px-5">Get Started</Button>
             </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold mb-8 animate-fade-in">
               <ZapIcon className="h-3 w-3" />
               <span>v2.0 JUST RELEASED</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-500">
               AI-Powered Inventory <br /> Management for Giants.
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
               Stop manually tracking stock. Use our edge AI vision system to monitor inventory, 
               predict shortages, and automate replenishment in real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
               <Link href="/dashboard">
                  <Button size="lg" className="h-12 px-8 bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-bold group">
                    Enter Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
               </Link>
               <Button size="lg" variant="outline" className="h-12 px-8 border-zinc-800 text-white hover:bg-zinc-900 font-bold">
                 Request Demo
               </Button>
            </div>

            {/* Hero Mockup */}
            <div className="relative mx-auto max-w-5xl group">
               <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
                  <div className="border-b border-zinc-800 bg-zinc-900/50 px-4 py-2 flex items-center gap-2">
                     <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                     </div>
                     <div className="ml-4 h-5 w-64 rounded bg-zinc-800/50" />
                  </div>
                  <div className="p-4 md:p-8 aspect-video flex items-center justify-center bg-zinc-950">
                      <div className="grid grid-cols-4 gap-4 w-full h-full opacity-40">
                         <div className="col-span-1 h-full bg-zinc-900 rounded-lg animate-pulse" />
                         <div className="col-span-3 space-y-4">
                            <div className="h-8 w-1/3 bg-zinc-900 rounded-lg animate-pulse" />
                            <div className="grid grid-cols-3 gap-4">
                               <div className="h-24 bg-zinc-900 rounded-lg animate-pulse" />
                               <div className="h-24 bg-zinc-900 rounded-lg animate-pulse" />
                               <div className="h-24 bg-zinc-900 rounded-lg animate-pulse" />
                            </div>
                            <div className="h-48 bg-zinc-900 rounded-lg animate-pulse" />
                         </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">Next-Gen Interface</h3>
                            <p className="text-sm text-zinc-500">Fast. Accurate. Predictive.</p>
                         </div>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-zinc-950">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Core Infrastructure</h2>
               <p className="text-zinc-500 max-w-xl mx-auto">Built from the ground up for modern logistics operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: 'Computer Vision', icon: Scan, desc: 'Real-time object detection and tracking using edge AI processing.' },
                 { title: 'Predictive Alerts', icon: Bell, desc: 'Avoid outages before they happen with our neural demand forecasting.' },
                 { title: 'Global Sync', icon: Globe, desc: 'Multi-warehouse synchronization with millisecond latency.' },
                 { title: 'Smart Batching', icon: Package, desc: 'Automatic QR/RFID batching and lifecycle tracking.' },
                 { title: 'Enterprise Security', icon: Shield, desc: 'End-to-end encrypted audits and multi-factor authentication.' },
                 { title: 'Live Analytics', icon: BarChart, desc: 'Advanced financial data visualization and export capabilities.' },
               ].map((feat, i) => (
                 <Card key={i} className="border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all duration-300 group">
                    <CardContent className="p-8">
                       <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <feat.icon className="h-6 w-6 text-emerald-500" />
                       </div>
                       <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                       <p className="text-zinc-500 leading-relaxed text-sm">{feat.desc}</p>
                    </CardContent>
                 </Card>
               ))}
            </div>
          </div>
        </section>

        {/* Status Section */}
        <section className="py-24 border-t border-zinc-900 bg-zinc-950">
           <div className="container mx-auto px-6 flex flex-col items-center text-center">
              <div className="flex gap-12 flex-wrap justify-center mb-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                 <div className="flex items-center gap-2 text-2xl font-bold"><CheckCircle className="text-emerald-500 h-6 w-6" /> AcmeCorp</div>
                 <div className="flex items-center gap-2 text-2xl font-bold"><CheckCircle className="text-emerald-500 h-6 w-6" /> Globex</div>
                 <div className="flex items-center gap-2 text-2xl font-bold"><CheckCircle className="text-emerald-500 h-6 w-6" /> StarkInd</div>
                 <div className="flex items-center gap-2 text-2xl font-bold"><CheckCircle className="text-emerald-500 h-6 w-6" /> OmniCP</div>
              </div>
              <h2 className="text-2xl font-medium text-zinc-400">Scale your inventory to millions of units.</h2>
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
           <div className="absolute inset-0 bg-emerald-500/5" />
           <div className="container mx-auto px-6 relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to modernize?</h2>
              <div className="flex gap-4 justify-center">
                 <Link href="/dashboard">
                    <Button size="lg" className="h-14 px-10 bg-emerald-500 text-black font-black hover:bg-emerald-400">
                       Start Free Trial
                    </Button>
                 </Link>
              </div>
              <p className="mt-6 text-zinc-500 text-sm">No credit card required. Setup in 5 minutes.</p>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 bg-zinc-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-sm gap-8">
           <div className="flex items-center gap-6">
              <span>© 2026 SmartStock Inc.</span>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
           </div>
           <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
           </div>
        </div>
      </footer>

    </div>
  )
}
