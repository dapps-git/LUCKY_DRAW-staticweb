import { useState } from 'react'
import { Upload, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react'

type Stage = 'idle' | 'uploading' | 'validating' | 'done'

export function ImportPage() {
  const [stage, setStage] = useState<Stage>('idle')
  const [fileName, setFileName] = useState('')

  const run = (name: string) => {
    setFileName(name)
    setStage('uploading')
    setTimeout(() => setStage('validating'), 1000)
    setTimeout(() => setStage('done'), 2200)
  }

  const downloadTemplate = () => {
    const csv =
      'Full Name,Phone Number,Address,Location\nMuhammed Saleel,9876543210,Main Road,Valanchery\nAisha Rahman,9745123489,Kottakkal Road,Malappuram\n'
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'VF2026-Sample-Participants.csv'
    a.click()
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-light tracking-wide text-[#140d10] sm:text-3xl">
        Bulk Participant Import
      </h1>
      <p className="mt-1 text-xs font-light text-black/60 sm:text-sm">
        Import participant lists from Excel (.xlsx, .xls) or CSV files directly into the lucky draw pool.
      </p>

      {/* Upload Zone */}
      <label className="mt-6 flex min-h-[220px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#d4a017] bg-white p-6 text-center transition hover:border-[#6b1020] hover:bg-[#faf7f2]">
        <div className="flex h-12 w-12 items-center justify-center border border-[#6b1020]/20 bg-[#f7f0e6] text-[#6b1020]">
          <Upload size={22} />
        </div>
        <p className="mt-3 text-sm font-medium text-[#140d10]">Click or Drag & Drop Excel Spreadsheet</p>
        <p className="mt-1 text-xs font-light text-black/50">Supports .xlsx, .xls, .csv with standard participant columns</p>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) run(f.name)
          }}
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center gap-1.5 border border-[#6b1020] bg-[#6b1020] px-4 py-2.5 text-xs font-medium tracking-wider text-white transition hover:bg-[#851629]"
        >
          <Download size={14} /> DOWNLOAD SAMPLE TEMPLATE (.CSV)
        </button>
        <span className="text-xs font-light text-black/50">Template contains: Name, Phone, Address, Location</span>
      </div>

      {stage !== 'idle' && (
        <div className="mt-8 border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-light text-black/70">
            <FileSpreadsheet size={16} className="text-[#6b1020]" /> {fileName}
          </div>
          <p className="font-display mt-2 text-xl font-light text-[#140d10]">
            {stage === 'uploading' && 'Uploading spreadsheet…'}
            {stage === 'validating' && 'Validating phone numbers and locations…'}
            {stage === 'done' && 'Import Successful & Validated'}
          </p>

          {stage === 'done' && (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Total Rows Parsed', '500'],
                  ['Successfully Added', '480'],
                  ['Duplicates Ignored', '15'],
                  ['Invalid Mobile Nos', '5'],
                ].map(([k, v]) => (
                  <div key={k} className="border border-black/10 bg-[#f7f0e6] p-4">
                    <p className="text-[10px] font-light tracking-wider text-black/50 uppercase">{k}</p>
                    <p className="font-display mt-1 text-2xl font-light text-[#6b1020]">{v}</p>
                  </div>
                ))}
              </div>

              <h3 className="mt-8 font-display text-base font-light text-[#140d10]">
                Failed Validation Records
              </h3>
              <div className="mt-2 overflow-x-auto border border-black/10">
                <table className="w-full text-left text-xs font-light">
                  <thead className="border-b border-black/10 bg-[#f7f0e6] text-[10px] uppercase text-black/60">
                    <tr>
                      <th className="px-3 py-2">Row #</th>
                      <th className="px-3 py-2">Issue Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black/5">
                      <td className="px-3 py-2 font-mono">Row 42</td>
                      <td className="px-3 py-2 text-red-700">Invalid phone format (must be 10 digits)</td>
                    </tr>
                    <tr className="border-b border-black/5">
                      <td className="px-3 py-2 font-mono">Row 118</td>
                      <td className="px-3 py-2 text-red-700">Missing participant full name</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono">Row 301</td>
                      <td className="px-3 py-2 text-amber-700">Duplicate mobile number already registered</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
