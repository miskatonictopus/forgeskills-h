"use client";
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="p-6">
        <h2 className="text-lg font-bold">Algo se rompió</h2>
        <pre className="mt-4 p-3 bg-zinc-900 text-zinc-100 rounded">{String(error?.stack ?? error)}</pre>
        <button onClick={reset} className="mt-4 border px-3 py-1 rounded">Reintentar</button>
      </body>
    </html>
  );
}