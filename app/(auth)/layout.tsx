export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-background min-h-screen">
      <main>
        <div className="min-h-screen p-8">{children}</div>
      </main>
    </div>
  )
}
