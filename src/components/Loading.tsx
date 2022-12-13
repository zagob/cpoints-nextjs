export function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-t-2 border-l-2 rounded-full animate-spin-slow-medium" />
        <span className="text-2xl font-light">Carregando...</span>
      </div>
    </div>
  );
}
