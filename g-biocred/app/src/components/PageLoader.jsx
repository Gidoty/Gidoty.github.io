import { Leaf } from 'lucide-react'

export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Leaf className="h-10 w-10 animate-pulse text-accent" />
    </div>
  )
}
