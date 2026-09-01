export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-armit-teal/20 border-t-armit-teal"
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}
