import type { NavGroupData } from '@/types'
import { NavItem } from './NavItem'

export function NavGroup({ group, collapsed, onNavigate }: { group: NavGroupData; collapsed?: boolean; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-0.5">
      {!collapsed && <span className="px-3 py-1.5 text-caption text-content-tertiary font-semibold uppercase tracking-wide">{group.label}</span>}
      {group.items.map((item) => (
        <NavItem key={item.path} item={item} collapsed={collapsed} onNavigate={onNavigate} />
      ))}
    </div>
  )
}
