import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'

export default function CollapsibleSection({ title, defaultOpen = false, children }) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="rounded-xl border border-border bg-card">
          <DisclosureButton className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-text">
            <span>{title}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </DisclosureButton>
          <DisclosurePanel className="border-t border-border px-4 py-4">{children}</DisclosurePanel>
        </div>
      )}
    </Disclosure>
  )
}
