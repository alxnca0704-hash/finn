export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex flex-1 flex-col items-center bg-background px-6 py-12">
      <div className="my-auto flex w-full flex-col items-center gap-8">
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          Finn
        </span>
        {children}
      </div>
    </main>
  )
}
