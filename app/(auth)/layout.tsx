export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background">
      <main >
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  )
}