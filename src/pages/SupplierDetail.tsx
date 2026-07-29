import { useParams } from 'react-router-dom'
import { SupplierDetailHero } from '@/components/suppliers/SupplierDetailHero'
import {
  SupplierCortexSection,
  SupplierScoreSection,
  SupplierStatusRiskSection,
  SupplierContactsSection,
  SupplierCategoriesSection,
  SupplierUnitsSection,
  SupplierPurchasesOrdersSection,
  SupplierReceiptsDivergencesSection,
  SupplierPricesSection,
  SupplierDocumentsSection,
  SupplierNegotiationsSection,
  SupplierRisksSection,
  SupplierHistorySection,
} from './suppliers/SupplierDetailSections'
import { useSuppliers } from '@/hooks/useSuppliers'
import NotFound from './NotFound'

function SupplierDetailBody({ supplierId }: { supplierId: string }) {
  const { allSuppliers } = useSuppliers()
  const supplier = allSuppliers.find((s) => s.id === supplierId)

  if (!supplier) return <NotFound />

  return (
    <div className="flex flex-col gap-10">
      <SupplierDetailHero supplier={supplier} />
      <SupplierCortexSection supplier={supplier} />
      <SupplierScoreSection supplier={supplier} />
      <SupplierStatusRiskSection supplier={supplier} />
      <SupplierContactsSection supplier={supplier} />
      <SupplierCategoriesSection supplier={supplier} />
      <SupplierUnitsSection supplier={supplier} />
      <SupplierPurchasesOrdersSection supplier={supplier} />
      <SupplierReceiptsDivergencesSection supplier={supplier} />
      <SupplierPricesSection supplier={supplier} />
      <SupplierDocumentsSection supplier={supplier} />
      <SupplierNegotiationsSection supplier={supplier} />
      <SupplierRisksSection supplier={supplier} />
      <SupplierHistorySection supplier={supplier} />
    </div>
  )
}

export default function SupplierDetail() {
  const { supplierId } = useParams<{ supplierId: string }>()
  if (!supplierId) return <NotFound />
  return <SupplierDetailBody key={supplierId} supplierId={supplierId} />
}
