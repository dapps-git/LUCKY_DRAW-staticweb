import { useState } from 'react'
import { Upload, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { seedData } from '../../data/mockData'
import { formatParticipantsForExcelCsv, downloadCsvFile, parseCsvText } from '../../lib/exportCsv'

type Stage = 'idle' | 'uploading' | 'validating' | 'done'

export function ImportPage() {
  const { data, bulkRegisterParticipants } = useApp()
  const [stage, setStage] = useState<Stage>('idle')
  const [fileName, setFileName] = useState('')
  const [stats, setStats] = useState({
    totalRows: 0,
    added: 0,
    duplicates: 0,
    invalid: 0,
  })

  // Download complete 20 participants sample template formatted specifically for Microsoft Excel
  const downloadSampleTemplate = () => {
    const csvContent = formatParticipantsForExcelCsv(seedData.participants)
    downloadCsvFile(csvContent, 'Sample-Participants-Template.csv')
  }

  // Export all current registered participants to CSV
  const downloadCurrentParticipants = () => {
    const csvContent = formatParticipantsForExcelCsv(data.participants)
    downloadCsvFile(csvContent, `Registered-Participants-${data.participants.length}.csv`)
  }

  const handleFileUpload = (file: File) => {
    setFileName(file.name)
    setStage('uploading')

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setStage('validating')

      setTimeout(async () => {
        try {
          const parsed = parseCsvText(text)
          if (parsed.length === 0) {
            setStats({ totalRows: 0, added: 0, duplicates: 0, invalid: 1 })
            setStage('done')
            return
          }

          const res = await bulkRegisterParticipants(parsed)
          setStats({
            totalRows: parsed.length,
            added: res.added,
            duplicates: res.duplicates,
            invalid: res.invalid,
          })
          setStage('done')
        } catch {
          setStats({ totalRows: 0, added: 0, duplicates: 0, invalid: 1 })
          setStage('done')
        }
      }, 700)
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Import & Export Participants
        </h1>
        <p className="mt-0.5 text-xs text-slate-400 font-normal">
          Import or export participant records via CSV or Excel spreadsheet.
        </p>
      </div>

      {/* Upload Zone */}
      <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-pink-200 bg-white p-6 text-center transition hover:border-[#FF0B6B] hover:bg-pink-50/20 shadow-xs">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-50 text-[#FF0B6B]">
          <Upload size={20} />
        </div>
        <p className="mt-3 text-xs sm:text-sm font-semibold text-slate-800">Click or Drag & Drop CSV / Excel Spreadsheet</p>
        <p className="mt-1 text-[11px] font-normal text-slate-400">Supports .csv, .xlsx files with Name and Phone</p>
        <input
          type="file"
          accept=".csv,.txt,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFileUpload(f)
          }}
        />
      </label>

      {/* Download Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={downloadSampleTemplate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] px-3.5 py-2 text-xs font-medium text-white transition cursor-pointer"
          >
            <Download size={13} />
            <span>Sample Template</span>
          </button>
          <button
            onClick={downloadCurrentParticipants}
            className="inline-flex items-center gap-1.5 rounded-lg border border-pink-200 bg-white hover:bg-pink-50 px-3.5 py-2 text-xs font-medium text-[#FF0B6B] transition cursor-pointer"
          >
            <Download size={13} />
            <span>Export Participants ({data.participants.length})</span>
          </button>
        </div>
      </div>

      {stage !== 'idle' && (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <FileSpreadsheet size={15} className="text-[#FF0B6B]" /> {fileName}
          </div>
          <p className="mt-2 text-base font-semibold text-slate-800">
            {stage === 'uploading' && 'Reading spreadsheet rows…'}
            {stage === 'validating' && 'Validating phone numbers and registering…'}
            {stage === 'done' && 'Spreadsheet Processed Successfully'}
          </p>

          {stage === 'done' && (
            <>
              <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
                {[
                  ['Total Rows', String(stats.totalRows)],
                  ['Added', String(stats.added)],
                  ['Duplicates', String(stats.duplicates)],
                  ['Invalid', String(stats.invalid)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-pink-100 bg-pink-50/30 p-3">
                    <p className="text-[10px] font-medium text-slate-400 uppercase">{k}</p>
                    <p className="mt-1 text-lg font-bold text-[#FF0B6B]">{v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>{stats.added} new participants</strong> added to database and eligible for lucky draws.
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}


