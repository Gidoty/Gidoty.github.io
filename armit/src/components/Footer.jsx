export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-armit-panel">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-armit-muted sm:px-6 lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} ARMIT — African Refinery Margin Intelligence Tool. All
          rights reserved.
        </p>
      </div>
    </footer>
  )
}
