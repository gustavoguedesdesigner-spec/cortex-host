import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface TableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  getRowId: (row: T) => string
  onRowClick?: (row: T) => void
  className?: string
}

const alignClasses = { left: 'text-left', right: 'text-right', center: 'text-center' }

export function Table<T>({ columns, data, getRowId, onRowClick, className }: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border-subtle', className)}>
      <table className="w-full text-body">
        <thead>
          <tr className="bg-surface-3 border-b border-border-subtle">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('px-4 py-3 text-label text-content-tertiary font-semibold', alignClasses[col.align ?? 'left'])}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={getRowId(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-border-subtle last:border-b-0 bg-surface-2 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-surface-3',
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3 text-content-primary', alignClasses[col.align ?? 'left'], col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
