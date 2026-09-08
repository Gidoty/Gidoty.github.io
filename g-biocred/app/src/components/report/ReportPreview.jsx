import { Leaf } from 'lucide-react'

export default function ReportPreview({ sections, meta }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white text-gray-900 shadow-xl">
      <div className="p-8 sm:p-10">
        <div className="flex flex-col justify-between gap-4 border-b-2 border-accent pb-4 sm:flex-row sm:items-start">
          <div className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-accent" />
            <span className="text-2xl font-bold text-accent">G-BioCred</span>
          </div>
          <div className="text-sm text-gray-600 sm:text-right">
            <p className="font-semibold text-gray-800">Agro-Waste-to-Energy Feasibility Report</p>
            <p>Date: {meta.reportDateLabel}</p>
            <p>Ref: G-BioCred-{meta.refHash}</p>
          </div>
        </div>

        <div className="mt-4 space-y-1 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">Prepared for:</span> {meta.applicantName || 'Not specified'}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Project:</span> {meta.projectName}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Location:</span> {meta.location || 'Not specified'}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Purpose:</span> {meta.purpose}
          </p>
          <p className="pt-2 text-xs italic text-gray-500">
            Prepared using G-BioCred v1.0 — an open-access biogas yield and carbon verification
            calculator developed at the NLNG Centre for Gas, Refining and Petrochemical
            Engineering, University of Port Harcourt.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <div key={section.key}>
              <h2 className="text-lg font-bold text-accent">{section.title}</h2>
              <div className="mt-2 space-y-2">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-gray-800">
                    {p}
                  </p>
                ))}
              </div>
              {section.table && (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        {section.table.headers.map((h) => (
                          <th key={h} className="py-1.5 pr-4 font-semibold text-gray-900">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, i) => (
                        <tr key={i} className="border-b border-gray-200">
                          {row.map((cell, j) => (
                            <td key={j} className="py-1.5 pr-4 text-gray-700">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {section.footnote && <p className="mt-1 text-xs italic text-gray-500">{section.footnote}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
