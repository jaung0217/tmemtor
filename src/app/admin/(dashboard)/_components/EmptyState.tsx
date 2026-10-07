export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
      {message}
    </p>
  );
}
