import type { NavGroupData } from '@/types'
import { NavItem } from './NavItem'

export function NavGroup({ group, expanded, onNavigate }: { group: NavGroupData; expanded?: boolean; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {expanded ? (
        <span className="w-full px-3 pb-1.5 pt-2 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-tertiary">{group.label}</span>
      ) : (
        <span className="my-1 h-px w-6 bg-border" aria-hidden="true" />
      )}
      <div className={expanded ? 'flex w-full flex-col gap-0.5' : 'flex flex-col items-center gap-1'}>
        {group.items.map((item) => (
          <NavItem key={item.path} item={item} expanded={expanded} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  )
}
