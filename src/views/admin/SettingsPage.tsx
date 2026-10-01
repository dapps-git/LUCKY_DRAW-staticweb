import { useState } from 'react'
import { Toast } from '../../components/Toast'
import { useApp } from '../../context/AppContext'

export function SettingsPage() {
  const { resetToDefaultData } = useApp()
  const [toast, setToast] = useState('')

  return (
    <div className="max-w-xl space-y-6 font-sans">
      {toast && <Toast message={toast} onDone={() => setToast('')} />}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Campaign Settings
        </h1>
        <p className="mt-0.5 text-xs text-slate-400 font-normal">
          Configure campaign titles, parameters, and storage settings.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
        <label className="block text-xs font-medium text-slate-700">
          Campaign Title
          <input
            defaultValue="Lucky Draw 2026"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#FF0B6B] sm:text-sm"
          />
        </label>

        <label className="block text-xs font-medium text-slate-700">
          Campaign Tagline
          <input
            defaultValue="Celebrate. Participate. Win Big!"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#FF0B6B] sm:text-sm"
          />
        </label>

        <label className="block text-xs font-medium text-slate-700">
          Next Scheduled Draw Date
          <input
            defaultValue="15 September 2026"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#FF0B6B] sm:text-sm"
          />
        </label>

        <div className="rounded-lg border border-pink-100 bg-pink-50/40 p-3 text-xs font-normal text-slate-600">
          All participant registrations and lucky draw winners are safely preserved in the database.
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setToast('Settings successfully saved!')}
            className="rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] px-5 py-2 text-xs font-medium text-white transition cursor-pointer"
          >
            Save Settings
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all participants, draws and winners to default initial demo dataset?')) {
                resetToDefaultData()
                setToast('Demo data restored to original initial state!')
              }
            }}
            className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 transition cursor-pointer"
          >
            Reset to Default Data
          </button>
        </div>
      </div>
    </div>
  )
}

