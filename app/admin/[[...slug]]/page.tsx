'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import client-side React Admin App to disable SSR for complex canvas/audio/PDF generators
const DynamicAdminApp = dynamic(() => import('../../../src/AdminApp').then((mod) => mod.AdminApp), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#f8f6f0] flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-3 border-[#7a1426] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-600">Loading Valanchery Admin Console...</p>
      </div>
    </div>
  ),
})

export default function AdminPage() {
  return <DynamicAdminApp />
}
