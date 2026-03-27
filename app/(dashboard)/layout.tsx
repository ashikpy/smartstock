import { Sidebar } from '@/components/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
