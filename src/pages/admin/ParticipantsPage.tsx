import { useMemo, useState } from 'react'
import { LOCATIONS } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { formatShortDate, isValidIndianPhone } from '../../lib/format'
import type { Participant, ParticipantStatus } from '../../types'
import { Search, Eye, Edit, Trash2, X } from 'lucide-react'

const PAGE = 8

export function ParticipantsPage() {
  const { data, updateParticipant, deleteParticipant } = useApp()
  const [q, setQ] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [view, setView] = useState<Participant | null>(null)
  const [edit, setEdit] = useState<Participant | null>(null)

  const filtered = useMemo(() => {
    return data.participants.filter((p) => {
      const hit = `${p.id} ${p.name} ${p.phone} ${p.location}`.toLowerCase().includes(q.toLowerCase())
      return hit && (!location || p.location === location) && (!status || p.status === status)
    })
  }, [data.participants, q, location, status])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE)

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-light tracking-wide text-[#140d10] sm:text-3xl">
            Participants Directory
          </h1>
          <p className="mt-1 text-xs font-light text-black/60 sm:text-sm">
            Total {data.participants.length} registered festival entries
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            placeholder="Search name, phone, ID…"
            className="w-full border border-black/15 bg-white px-3.5 py-2 text-xs font-light text-black outline-none transition focus:border-[#d4a017] sm:text-sm"
          />
          <Search className="pointer-events-none absolute right-3 top-2.5 text-black/40" size={15} />
        </div>

        <select
          value={location}
          onChange={(e) => {
            setLocation(e.target.value)
            setPage(1)
          }}
          className="border border-black/15 bg-white px-3 py-2 text-xs font-light text-black outline-none sm:text-sm"
        >
          <option value="">All Locations</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="border border-black/15 bg-white px-3 py-2 text-xs font-light text-black outline-none sm:text-sm"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto border border-black/10 bg-white shadow-sm">
        <table className="w-full min-w-[860px] text-left text-xs font-light sm:text-sm">
          <thead className="border-b border-black/10 bg-[#f7f0e6] text-[11px] font-medium tracking-wider text-black/60 uppercase">
            <tr>
              <th className="px-3 py-3">ID</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Phone</th>
              <th className="px-3 py-3">Location</th>
              <th className="px-3 py-3">Registered</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-black/5 hover:bg-[#faf7f2]">
                <td className="px-3 py-3 font-mono text-xs font-normal text-[#6b1020]">{p.id}</td>
                <td className="px-3 py-3 font-medium text-[#140d10]">{p.name}</td>
                <td className="px-3 py-3 text-black/70">{p.phone}</td>
                <td className="px-3 py-3 text-black/70">{p.location}</td>
                <td className="px-3 py-3 text-black/60">{formatShortDate(p.registeredAt)}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase ${
                      p.status === 'Active'
                        ? 'border border-emerald-600/30 bg-emerald-50 text-emerald-700'
                        : 'border border-red-600/30 bg-red-50 text-red-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => setView(p)}
                      className="border border-black/10 px-2 py-1 text-[11px] font-light text-black/70 hover:border-black hover:text-black"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEdit({ ...p })}
                      className="border border-black/10 px-2 py-1 text-[11px] font-light text-black/70 hover:border-black hover:text-black"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteParticipant(p.id)}
                      className="border border-red-200 px-2 py-1 text-[11px] font-light text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-black/50">
                  No participants found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-light text-black/60">
        <p>
          Page {page} of {pages} ({filtered.length} total)
        </p>
        <div className="flex gap-1.5">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="border border-black/15 bg-white px-3 py-1.5 transition hover:bg-black/5 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="border border-black/15 bg-white px-3 py-1.5 transition hover:bg-black/5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* View Modal */}
      {view && (
        <Modal onClose={() => setView(null)} title="Participant Details">
          <div className="space-y-3 text-xs font-light">
            <div className="border border-[#d4a017]/40 bg-[#f7f0e6] p-3">
              <p className="text-[10px] tracking-wider text-black/50 uppercase">Festival ID</p>
              <p className="font-mono text-base font-medium text-[#6b1020]">{view.id}</p>
            </div>
            <div>
              <p className="text-[10px] text-black/50 uppercase">Full Name</p>
              <p className="text-sm font-medium text-[#140d10]">{view.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-black/50 uppercase">Phone</p>
              <p className="text-sm text-[#140d10]">{view.phone}</p>
            </div>
            <div>
              <p className="text-[10px] text-black/50 uppercase">Location</p>
              <p className="text-sm text-[#140d10]">{view.location}</p>
            </div>
            <div>
              <p className="text-[10px] text-black/50 uppercase">Address</p>
              <p className="text-sm text-[#140d10]">{view.address}</p>
            </div>
            <div>
              <p className="text-[10px] text-black/50 uppercase">Status & Eligibility</p>
              <p className="text-sm text-emerald-700">{view.status} · {view.eligibility}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {edit && (
        <Modal onClose={() => setEdit(null)} title="Edit Participant">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-black/60 uppercase">Name</label>
              <input
                className="mt-1 w-full border border-black/20 bg-white px-3 py-2 text-xs font-light outline-none focus:border-[#d4a017]"
                value={edit.name}
                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] text-black/60 uppercase">Phone</label>
              <input
                className="mt-1 w-full border border-black/20 bg-white px-3 py-2 text-xs font-light outline-none focus:border-[#d4a017]"
                value={edit.phone}
                onChange={(e) => setEdit({ ...edit, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] text-black/60 uppercase">Address</label>
              <input
                className="mt-1 w-full border border-black/20 bg-white px-3 py-2 text-xs font-light outline-none focus:border-[#d4a017]"
                value={edit.address}
                onChange={(e) => setEdit({ ...edit, address: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] text-black/60 uppercase">Location</label>
              <select
                className="mt-1 w-full border border-black/20 bg-white px-3 py-2 text-xs font-light outline-none"
                value={edit.location}
                onChange={(e) => setEdit({ ...edit, location: e.target.value })}
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-black/60 uppercase">Status</label>
              <select
                className="mt-1 w-full border border-black/20 bg-white px-3 py-2 text-xs font-light outline-none"
                value={edit.status}
                onChange={(e) => setEdit({ ...edit, status: e.target.value as ParticipantStatus })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="pt-2">
              <button
                className="w-full border border-[#6b1020] bg-[#6b1020] py-2.5 text-xs font-medium tracking-wider text-white transition hover:bg-[#851629]"
                onClick={() => {
                  if (!isValidIndianPhone(edit.phone)) return
                  updateParticipant(edit.id, edit)
                  setEdit(null)
                }}
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md border-2 border-black/20 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
          <h3 className="font-display text-lg font-light text-[#140d10]">{title}</h3>
          <button onClick={onClose} className="text-black/50 hover:text-black">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
