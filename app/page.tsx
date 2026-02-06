export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">GHL Components</h1>
      <p className="text-muted-foreground text-center max-w-md">
        A shadcn/ui component registry for GoHighLevel integrations.
        Built for vibe coders.
      </p>
      <div className="mt-8">
        <code className="bg-muted px-4 py-2 rounded text-sm">
          npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-provider.json
        </code>
      </div>
    </main>
  )
}
