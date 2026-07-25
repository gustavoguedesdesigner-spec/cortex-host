import { useCallback } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import type { ApprovalStepStatus } from '@/types'

type ApprovalOverrideMap = Record<string, ApprovalStepStatus>

function overrideKey(versionId: string, ordem: number) {
  return `${versionId}:${ordem}`
}

/** Overrides de status de aprovação por etapa (versão + ordem), persistidos localmente sobre os dados estáticos da ficha. */
export function useRecipeApprovals() {
  const [overrides, setOverrides] = useLocalStorageState<ApprovalOverrideMap>('cortex-host:recipe-approval-overrides', {})

  const getStepStatus = useCallback(
    (versionId: string, ordem: number, baseStatus: ApprovalStepStatus): ApprovalStepStatus => overrides[overrideKey(versionId, ordem)] ?? baseStatus,
    [overrides],
  )

  const setStepStatus = useCallback(
    (versionId: string, ordem: number, status: ApprovalStepStatus) =>
      setOverrides((prev) => ({ ...prev, [overrideKey(versionId, ordem)]: status })),
    [setOverrides],
  )

  return { getStepStatus, setStepStatus }
}
