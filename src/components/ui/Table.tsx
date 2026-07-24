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
  /** Fixa a primeira coluna em tabelas largas */
  stickyFirstColumn?: boolean
}

const alignClasses = { left: 'text-left', right: 'text-right', center: 'text-center' }

export function Table<T>({ columns, data, getRowId, onRowClick, className, stickyFirstColumn }: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border bg-surface', className)}>
      <table className="w-full border-collapse text-support">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col, i) => (
              <th
                key={col.key}
                className={cn(
                  'whitespace-nowrap px-4 py-2.5 text-label font-medium text-ink-tertiary',
                  alignClasses[col.align ?? 'left'],
                  stickyFirstColumn && i === 0 && 'sticky left-0 bg-surface',
                )}
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
                'border-b border-border last:border-b-0 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-surface-hover',
              )}
            >
              {columns.map((col, i) => (
                <td
                  key={col.key}
                  className={cn(
                    'h-12 whitespace-nowrap px-4 text-ink-primary',
                    col.align === 'right' && 'tabular',
                    alignClasses[col.align ?? 'left'],
                    stickyFirstColumn && i === 0 && 'sticky left-0 bg-surface',
                    col.className,
                  )}
                >
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
