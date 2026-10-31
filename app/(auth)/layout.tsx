export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-background px-6 py-12">
      <span className="text-2xl font-semibold tracking-tight text-foreground">
        Finn
      </span>
      {children}
    </main>
  )
}
