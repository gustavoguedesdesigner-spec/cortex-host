import { useParams } from 'react-router-dom'
import { ReceiptDetailHero } from '@/components/receiving/ReceiptDetailHero'
import {
  ReceiptCortexSection,
  DocumentReadingSection,
  ConferenceItemsSection,
  ReceiptQuarantineSection,
  ReceiptDecisionSection,
  ReceiptTimelineSection,
} from './receiving/ReceiptDetailSections'
import { useReceiving } from '@/hooks/useReceiving'
import NotFound from './NotFound'

function ReceiptDetailBody({ receiptId }: { receiptId: string }) {
  const { allReceipts, updateReceiptStatus } = useReceiving()
  const receipt = allReceipts.find((r) => r.id === receiptId)

  if (!receipt) return <NotFound />

  return (
    <div className="flex flex-col gap-10">
      <ReceiptDetailHero receipt={receipt} />
      <ReceiptCortexSection receipt={receipt} />
      <DocumentReadingSection receipt={receipt} />
      <ConferenceItemsSection receipt={receipt} />
      <ReceiptQuarantineSection receipt={receipt} />
      <ReceiptDecisionSection receipt={receipt} updateReceiptStatus={updateReceiptStatus} />
      <ReceiptTimelineSection receipt={receipt} />
    </div>
  )
}

export default function ReceiptDetail() {
  const { receiptId } = useParams<{ receiptId: string }>()
  if (!receiptId) return <NotFound />
  return <ReceiptDetailBody key={receiptId} receiptId={receiptId} />
}
