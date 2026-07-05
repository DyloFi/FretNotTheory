export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Antigravity Blueprint
      </h1>
      <p className="text-muted-foreground">
        Next.js + TailwindCSS + shadcn/ui + Supabase, wired up and ready.
        Replace this page and start building.
      </p>
      <ul className="list-inside list-disc text-sm text-muted-foreground">
        <li>Edit <code>AGENTS.md</code> with this project&apos;s specifics</li>
        <li>Add your Supabase URL/anon key to <code>.env.local</code></li>
        <li>Start a session with the <code>session-start</code> skill</li>
      </ul>
    </main>
  );
}
