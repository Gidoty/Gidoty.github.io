import MapView from '../../dashboard/MapView.jsx'
import CorroborationModal from '../../dashboard/CorroborationModal.jsx'
import { useReportsWithDemo } from '../../../hooks/useReportsWithDemo.js'

export default function LiveHeatmapPanel() {
  const {
    combinedReports,
    usingDemoData,
    demoBannerDismissed,
    dismissDemoBanner,
    corroborationReport,
    handleCorroborate,
    handleConfirmCorroboration,
    closeCorroboration,
  } = useReportsWithDemo()

  return (
    <div className="h-full w-full">
      <MapView
        reports={combinedReports}
        onCorroborate={handleCorroborate}
        selectedReportId={null}
        showDemoBanner={usingDemoData && !demoBannerDismissed}
        onDismissDemoBanner={dismissDemoBanner}
      />

      {corroborationReport && (
        <CorroborationModal
          report={corroborationReport}
          onConfirm={handleConfirmCorroboration}
          onClose={closeCorroboration}
        />
      )}
    </div>
  )
}
