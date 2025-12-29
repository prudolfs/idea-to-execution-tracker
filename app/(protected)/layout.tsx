export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-">
      {/* <Sidebar /> */}
      <main className="pl-64">
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  )
}