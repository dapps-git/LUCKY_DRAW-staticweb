import { useState } from 'react'
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'
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
    downloadCsvFile(csvContent, 'Valanchery-Festival-Sample-20-Participants.csv')
  }

  // Export all current registered participants to CSV
  const downloadCurrentParticipants = () => {
    const csvContent = formatParticipantsForExcelCsv(data.participants)
    downloadCsvFile(csvContent, `Valanchery-Festival-Live-Participants-${data.participants.length}.csv`)
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
    <div>
      <h1 className="font-display text-2xl font-light tracking-wide text-[#140d10] sm:text-3xl">
        Bulk Participant Import & Export
      </h1>
      <p className="mt-1 text-xs font-light text-black/60 sm:text-sm">
        Import or export participant lists from Excel (.xlsx, .csv) with full phone number formatting and duplicate prevention.
      </p>

      {/* Upload Zone */}
      <label className="mt-6 flex min-h-[200px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#d4a017] bg-white p-6 text-center transition hover:border-[#6b1020] hover:bg-[#faf7f2]">
        <div className="flex h-12 w-12 items-center justify-center border border-[#6b1020]/20 bg-[#f7f0e6] text-[#6b1020]">
          <Upload size={22} />
        </div>
        <p className="mt-3 text-sm font-medium text-[#140d10]">Click or Drag & Drop CSV / Excel Spreadsheet</p>
        <p className="mt-1 text-xs font-light text-black/50">Supports .csv, .txt files with Name, Phone, Address, Location</p>
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
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={downloadSampleTemplate}
            className="inline-flex items-center gap-1.5 border border-[#6b1020] bg-[#6b1020] px-4 py-2.5 text-xs font-medium tracking-wider text-white transition hover:bg-[#851629]"
          >
            <Download size={14} /> DOWNLOAD SAMPLE TEMPLATE (20 PARTICIPANTS)
          </button>
          <button
            onClick={downloadCurrentParticipants}
            className="inline-flex items-center gap-1.5 border border-black/20 bg-[#f7f0e6] px-4 py-2.5 text-xs font-light tracking-wider text-black transition hover:bg-black/5"
          >
            <Download size={14} /> EXPORT LIVE PARTICIPANTS ({data.participants.length})
          </button>
        </div>
        <span className="text-xs font-light text-black/60">
          ✨ Formatted for Microsoft Excel (prevents 9.88E+09 scientific notation)
        </span>
      </div>

      {stage !== 'idle' && (
        <div className="mt-8 border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-light text-black/70">
            <FileSpreadsheet size={16} className="text-[#6b1020]" /> {fileName}
          </div>
          <p className="font-display mt-2 text-xl font-light text-[#140d10]">
            {stage === 'uploading' && 'Reading spreadsheet rows…'}
            {stage === 'validating' && 'Validating phone numbers, removing duplicates & registering…'}
            {stage === 'done' && 'Spreadsheet Processed Successfully'}
          </p>

          {stage === 'done' && (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Total Rows Parsed', String(stats.totalRows)],
                  ['Successfully Added', String(stats.added)],
                  ['Duplicates Ignored', String(stats.duplicates)],
                  ['Invalid Mobile Nos', String(stats.invalid)],
                ].map(([k, v]) => (
                  <div key={k} className="border border-black/10 bg-[#f7f0e6] p-4">
                    <p className="text-[10px] font-light tracking-wider text-black/50 uppercase">{k}</p>
                    <p className="font-display mt-1 text-2xl font-light text-[#6b1020]">{v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-light text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>{stats.added} new participants</strong> have been added to the festival database and are now eligible for live lucky draws!
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

