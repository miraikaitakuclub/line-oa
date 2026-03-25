export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
        <p className="mt-4 text-gray-600">読み込み中...</p>
      </div>
    </div>
  );
}
